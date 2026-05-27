import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Divider, Box, Chip
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import SchoolIcon from '@mui/icons-material/School'
import ClassIcon from '@mui/icons-material/Class'
import ScienceIcon from '@mui/icons-material/Science'
import PaymentIcon from '@mui/icons-material/Payment'
import EventNoteIcon from '@mui/icons-material/EventNote'
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AssessmentIcon from '@mui/icons-material/Assessment'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ALL_LINKS = [
  { label: 'Dashboard',       path: '/dashboard',   icon: <DashboardIcon />,    roles: ['ADMIN','PRINCIPAL','TEACHER','CLERK','STUDENT'] },
  { label: 'User Management', path: '/users',        icon: <PeopleIcon />,       roles: ['ADMIN'] },
  { label: 'Classes',         path: '/classes',      icon: <ClassIcon />,        roles: ['ADMIN'] },
  { label: 'Sections',        path: '/sections',     icon: <SchoolIcon />,       roles: ['ADMIN'] },
  { label: 'Subjects',        path: '/subjects',     icon: <ScienceIcon />,      roles: ['ADMIN'] },
  { label: 'Admission',       path: '/admission',    icon: <SchoolIcon />,       roles: ['CLERK','ADMIN'] },
  { label: 'Fee Payment',     path: '/fees',         icon: <PaymentIcon />,      roles: ['CLERK','ADMIN','PRINCIPAL'] },
  { label: 'Attendance',      path: '/attendance',   icon: <EventNoteIcon />,    roles: ['TEACHER','ADMIN'] },
  { label: 'Performance',     path: '/performance',  icon: <EmojiEventsIcon />,  roles: ['TEACHER','ADMIN','PRINCIPAL'] },
  { label: 'Syllabus',        path: '/syllabus',     icon: <MenuBookIcon />,     roles: ['TEACHER','ADMIN','PRINCIPAL'] },
  { label: 'Class Schedule',  path: '/schedule',     icon: <CalendarMonthIcon />,roles: ['PRINCIPAL','ADMIN'] },
  { label: 'Reports',         path: '/reports',      icon: <AssessmentIcon />,   roles: ['PRINCIPAL','ADMIN','CLERK'] },
  { label: 'Analysis',        path: '/analysis',     icon: <BarChartIcon />,     roles: ['PRINCIPAL','ADMIN'] },
  { label: 'My Portal',       path: '/student',      icon: <PersonIcon />,       roles: ['STUDENT'] },
]

const ROLE_COLOR = { ADMIN:'#7b1fa2', PRINCIPAL:'#1565c0', TEACHER:'#2e7d32', CLERK:'#e65100', STUDENT:'#00695c' }

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = ALL_LINKS.filter(l => l.roles.includes(user?.role))

  const content = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            School Admin
          </Typography>
          <Chip
            label={user?.role}
            size="small"
            sx={{ bgcolor: ROLE_COLOR[user?.role], color: '#fff', fontSize: 10, height: 18 }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <List dense>
        {links.map(({ label, path, icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => { navigate(path); onClose() }}
              sx={{
                '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
                '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        open
      >
        {content}
      </Drawer>
    </Box>
  )
}
