import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

interface VoteCardProps {
  firstName: string;
  lastName: string;
  vote: null | string;
  showResults: boolean;
}

const VoteCard = ({
  vote,
  firstName,
  lastName,
  showResults,
}: VoteCardProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Card
        variant={vote ? 'outlined' : undefined}
        key={'0'}
        sx={{
          mb: 1,
          width: '83px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: vote
            ? theme.palette.primary.main
            : theme.palette.grey[700],
        }}
      >
        <CardContent>
          {vote && (
            <Typography
              component="p"
              variant="h6"
              textAlign="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              {vote}
            </Typography>
          )}
        </CardContent>
      </Card>
      <Typography component="div" variant="h6">
        {`${firstName} ${lastName}`}
      </Typography>
    </Box>
  );
};

export default VoteCard;
