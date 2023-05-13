import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ p: 6 }} component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        {`© ${process.env.REACT_APP_NAME} ${new Date().getFullYear()}`}
      </Typography>
    </Box>
  );
};

export default Footer;
