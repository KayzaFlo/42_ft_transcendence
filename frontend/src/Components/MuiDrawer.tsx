import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MenuOpen, ChatBubble } from '@mui/icons-material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import styledEmotion from '@emotion/styled';

interface DrawerItem {
    icon: React.ReactNode;
    item: string;
}

const drawerWidth = 160;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const StyledListItemIcon = styledEmotion(ListItemIcon)`
    color: #242424;
`;

const StyledListItemText = styledEmotion(ListItemText)`
    color: #242424;
`;

export default function PersistentDrawerLeft() {
    const [openDrawer, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const renderDrawerMenu: DrawerItem[] = [
        {
            item: 'Chat',
            icon: <ChatBubble />,
        },
        {
            item: 'Game',
            icon: <SportsEsportsIcon />,
        },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(openDrawer && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={openDrawer}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <MenuOpen />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {renderDrawerMenu.map((item: DrawerItem, index) => {
                        return (
                            <ListItemButton key={index}>
                                <StyledListItemIcon>
                                    {item.icon}
                                </StyledListItemIcon>
                                <StyledListItemText>
                                    {item.item}
                                </StyledListItemText>
                            </ListItemButton>
                        );
                    })}
                </List>
                <Divider />
            </Drawer>
            <Main open={openDrawer}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}
