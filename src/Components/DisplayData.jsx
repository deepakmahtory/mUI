import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DisplayData = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(); // State for total number of users
  const [pageSize, setPageSize] = useState(2); // State for rows per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page

  // Fetch total user count initially
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users') // Replace with your actual count endpoint
      .then((response) => {
        console.log(response);
        console.log(response.data.length);
        setTotalCount(response.data.length); // Update total count state
      })
      .catch((error) => {
        console.error('Error fetching user count:', error);
      });
  }, []);

  // Fetch users for the current page on mount, page change, or page size change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users?page=${currentPage}&per_page=${pageSize}` // Adjusted URL for server-side pagination
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1); // Adjust for 1-based indexing on server-side
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(currentPage+1); // Reset to first page when page size changes
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'Email' },
  ];

  return (
    <div>
      <DataGrid
        columns={columns}
        rows={users}
        rowCount={totalCount} // Provide total count for accurate pagination
        paginationMode="server"
        pageSize={pageSize}
        rowsPerPageOptions={[2,10]}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default DisplayData;
