import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ROLE_COLOR = {
  ADMIN: '#7b1fa2', PRINCIPAL: '#1565c0', TEACHER: '#2e7d32', CLERK: '#e65100', STUDENT: '#0288d1'
}

export default function Navbar({ drawerWidth, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar
      position="fixed"
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        width: { sm: `calc(100% - ${drawerWidth}px)` }, 
        ml: { sm: `${drawerWidth}px` }
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
          School Administration System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
            {user?.fullName}
          </Typography>
          <Avatar
            sx={{ bgcolor: ROLE_COLOR[user?.role] || '#1565c0', cursor: 'pointer', width: 36, height: 36, fontSize: 14 }}
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            {user?.fullName?.charAt(0)}
          </Avatar>
        </Box>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" fontWeight={600}>{user?.fullName}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
