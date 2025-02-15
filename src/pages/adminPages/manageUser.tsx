/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Table, Switch, message, Skeleton, Tag } from 'antd';
import { useGetUsersQuery, useBlockUserMutation } from '../../redux/features/auth/authApi';
import { useAppSelector } from '../../redux/hook';
import { useCurrentToken } from '../../redux/features/auth/authSlice';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, data, error } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const token = useAppSelector(useCurrentToken); // Get token from Redux store
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();

  useEffect(() => {
    if (data) {
        const filtredData = data?.data.filter((item: any) => item.role === 'user')
      setUsers(filtredData); // Assuming 'data' has a 'data' field with the users
    }
  }, [data]);

  const handleBlockChange = async (checked: boolean, userId: string) => {
    try {
        console.log(token);
      const response = await blockUser({ userId, isBlocked: checked, token }).unwrap();
      const updatedUsers: any = users.map((user: any) =>
        user._id === userId ? { ...user, isBlocked: checked } : user
      );
      setUsers(updatedUsers);
      message.success(response.message || `User ${checked ? 'deactivated' : 'activated'}`);
    } catch (err: any) {
        console.log(err)
      message.error("Failed to update user status. Please try again.");
    }
  };

//   const handleDeleteUser = (userId: any) => {
//     const updatedUsers = users.filter((user: any) => user._id !== userId);
//     setUsers(updatedUsers);
//     message.success('User deleted successfully');
//   };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (isBlocked: any, record: any) => (
        <Switch
          checked={isBlocked}
          onChange={(checked) => handleBlockChange(checked, record._id)}
          loading={isBlocking}
        />
      ),
    },
    {
        title: 'Status',
        key: 'status',
        render: (_: any, record: any) => (
          <>
            {record.isBlocked ? (
              <Tag color="red" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '95px'}}>
                Blocked
              </Tag>
            ) : (
              <Tag color="blue" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '95px' }}>
                Active
              </Tag>
            )}
          </>
        ),
      }
  ];

  // Handle loading, error, and empty states
  if (isLoading) {
    return <>
        <Skeleton />
        <br />
        <Skeleton />
    </>;
  }

  if (error) {
    return <div>Error fetching users. Please try again later.</div>;
  }

  if (!data || !data.data || data.data.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <div style={{marginTop: '50px'}}>
      <h1>Manage Users</h1>
      <Table 
        dataSource={users} 
        columns={columns} 
        scroll={{ x: 'max-content' }}
        rowKey="_id" 
      />
    </div>
  );
};

export default ManageUser;
