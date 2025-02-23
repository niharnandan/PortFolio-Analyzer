import * as React from 'react';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import useIsMobile from '../services/Helpers/isMobile';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import InfoIcon from '@mui/icons-material/Info';

const StyledBox = styled(Box)({
  flexGrow: 1,
});

interface ButtonAppBarProps {
  toggleTheme: () => void;
  isAuthenticated: boolean;  // Add isAuthenticated as a prop
  handleLogout: () => void;   // Add handleLogout as a prop
}

const iconSx = {
  marginRight: '-6px',
};

const ButtonAppBar: React.FC<ButtonAppBarProps> = ({ toggleTheme, isAuthenticated, handleLogout }) => {
  const isMobile = useIsMobile();
  const [firmName, setFirmName] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getFirmName = async () => {
      setFirmName("My Firm Name");
    };
    getFirmName();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <StyledBox>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => {
              navigate('/');
            }}
          >
            {firmName}
          </Typography>
          
          {/* Only show the Logout button if the user is authenticated */}
          {isAuthenticated && (
            <Button
              color="inherit"
              size={isMobile ? 'small' : 'medium'}
              onClick={handleLogout}
              startIcon={<ConnectWithoutContactIcon sx={iconSx} />}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {isMobile && (
          <MenuItem
            onClick={() => {
              handleNavigation('/');
            }}
          >
            Home
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            toggleTheme();
            handleMenuClose();
          }}
        >
          Toggle Theme
        </MenuItem>
      </Menu>
    </StyledBox>
  );
};

export default ButtonAppBar;
