import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import { ValidationError } from 'express-validator';
import { t } from 'i18next';
import { useState } from 'react';
import { useCreateVoting } from 'session/hooks/useCreateVoting';
import SocketSessionVotingData from 'session/types/SocketSessionVotingData';
import CreateVotingModal from './CreateVotingDialog';

interface VotingPanelProps {
  voting?: SocketSessionVotingData;
  isAdmin: boolean;
  showVotes: boolean;
  onShowVotes: () => void;
  onCreateSuccess: (votingData: { name: string; description?: string }) => void;
  sessionHashId: string;
}

const VotingPanel = ({
  voting,
  isAdmin,
  showVotes,
  onShowVotes,
  onCreateSuccess,
  sessionHashId,
}: VotingPanelProps) => {
  const snackbar = useSnackbar();
  const { authToken } = useAuth();
  const { isCreating, createVoting } = useCreateVoting();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleCreateVoting = async (votingData: {
    name: string;
    description?: string;
  }): Promise<ValidationError[]> => {
    try {
      const createdVoting = await createVoting({
        sessionHashId,
        votingData,
        authToken,
      });
      onCreateSuccess({
        name: createdVoting.name,
        description: createdVoting.description,
      });
      snackbar.success(t('session.createVoting.notifications.success'));
      setOpenCreateDialog(false);

      return [];
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        return err.response.data.errors as ValidationError[];
      }
      snackbar.error(t('common.errors.unexpected.subTitle'));
      setOpenCreateDialog(false);
      return [];
    }
  };

  let title = voting?.name;
  if (!voting) {
    title = isAdmin ? t('session.toStart') : t('session.waiting');
  }

  return (
    <>
      <Card sx={{ mb: { xs: 2, md: 5 } }}>
        <CardHeader title={title}></CardHeader>

        {voting?.description && (
          <CardContent sx={{ py: 0 }}>
            <Typography sx={{ wordBreak: 'break-all' }}>
              {voting.description}
            </Typography>
          </CardContent>
        )}

        <CardActions>
          {isAdmin && (
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => setOpenCreateDialog(true)}
                sx={{ mr: { xs: 1, md: 2 } }}
              >
                {t('session.createVoting')}
              </Button>

              <Button
                variant="outlined"
                onClick={onShowVotes}
                disabled={showVotes}
              >
                {t('session.showVotes')}
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>

      {openCreateDialog && (
        <CreateVotingModal
          onCreate={handleCreateVoting}
          onClose={() => setOpenCreateDialog(false)}
          open={openCreateDialog}
          processing={isCreating}
        />
      )}
    </>
  );
};

export default VotingPanel;
