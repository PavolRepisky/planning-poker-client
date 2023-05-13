import {
  Box,
  Button,
  Card,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import SocketSessionUserVoteData from 'session/types/SocketSessionUserVoteData';

interface VoteCardProps {
  value: string;
  row: number;
  column: number;
  selected: boolean;
  onClick: (vote: SocketSessionUserVoteData) => void;
}

const VoteCard = ({ value, row, column, selected, onClick }: VoteCardProps) => {
  const theme = useTheme();

  return (
    <Tooltip title={value}>
      <Card
        onClick={() => onClick({ row, column })}
        component={Button}
        sx={{
          minWidth: 'none',
          maxWidth: 'none',
          width: { xs: '2.5rem', sm: '4.85rem', lg: '6rem', xl: '7rem' },
          height: { xs: '6.5em', sm: '7rem', lg: '8.5rem', xl: '10rem' },
          display: 'flex',
          flexDirection: 'row',
          p: '3% 6%',
          border: selected ? `6px solid ${theme.palette.divider}` : 'none',
          '&:hover': {
            background: theme.palette.background.paper,
            border: `6px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          sx={{
            alignSelf: 'start',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '25%',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              fontSize: {
                xs: '0.75rem',
                sm: '1rem',
                lg: '1.25rem',
                xl: '1.5rem',
              },
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            alignSelf: 'center',
            justifySelf: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: '60%',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '0.5rem',
          }}
        >
          <Typography
            variant="h1"
            component="h2"
            textAlign="center"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              fontWeight: 'bold',
              fontSize: {
                xs: '1rem',
                sm: '1.75rem',
                lg: '2.25rem',
                xl: '3.25rem',
              },
            }}
          >
            {value}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          textAlign={'right'}
          sx={{
            alignSelf: 'end',
            ml: 'auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '25%',
            fontWeight: 'bold',
            fontSize: {
              xs: '0.75rem',
              sm: '1rem',
              lg: '1.25rem',
              xl: '1.5rem',
            },
          }}
        >
          {value}
        </Typography>
      </Card>
    </Tooltip>
  );
};

export default VoteCard;
