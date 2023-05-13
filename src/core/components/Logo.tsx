import { LogoDev as LogoSvg } from '@mui/icons-material';
import { Box, BoxProps } from '@mui/material';

type LogoProps = {
  size?: number;
} & BoxProps;

const Logo = ({ size = 40, ...boxProps }: LogoProps) => {
  return (
    <Box {...boxProps}>
      <LogoSvg height={size} width={size} fontSize="large" />
    </Box>
  );
};

export default Logo;
