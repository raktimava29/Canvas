import { Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <Heading>Welcome, {user ? user.name : 'User'}</Heading>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Login;
