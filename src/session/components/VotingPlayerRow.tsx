import { Check as CheckIcon, Person as PersonIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';

interface VotingPlayerRowProps {
  key: string;
  firstName: string;
  lastName: string;
  voted: boolean;
  voteValue?: string;
}

const VotingPlayerRow = ({
  key,
  firstName,
  lastName,
  voted,
  voteValue,
}: VotingPlayerRowProps) => {
  return (
    <Card key={key} sx={{ mb: 1 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2 }}>
          <PersonIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography component="div" variant="h6">
            {`${firstName} ${lastName}`}
          </Typography>
        </Box>

        <Box>
          {voted && !voteValue && <CheckIcon />}
          {voteValue && (
            <Typography component="h2" variant="h4">
              {voteValue}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VotingPlayerRow;
