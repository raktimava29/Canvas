import { Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div>
      <Heading>Welcome, {user ? user.name : 'User'}</Heading>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Login;
