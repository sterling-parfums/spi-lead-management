import {
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";

type AppBarProps = {
  onDrawerToggle?: () => void;
  title: string;
};
export function AppBar({ onDrawerToggle, title }: AppBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
}
