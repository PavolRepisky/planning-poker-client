import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import ServerValidationError from 'core/types/ServerValidationError';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateVotingDialog from 'session/components/CreateVotingDialog';
import { useCreateVoting } from 'session/hooks/useCreateVoting';
import SocketSessionVotingData from 'session/types/SocketSessionVotingData';

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
  const { isCreating, createVoting } = useCreateVoting();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { t } = useTranslation();

  const handleCreateVoting = async (votingData: {
    name: string;
    description?: string;
  }): Promise<ServerValidationError[]> => {
    try {
      const createdVoting = await createVoting({
        sessionHashId,
        votingData,
      });
      onCreateSuccess({
        name: createdVoting.name,
        description: createdVoting.description,
      });
      snackbar.success(t('session.dialog.createVoting.notifications.success'));
      setOpenCreateDialog(false);

      return [];
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        return err.response.data.errors as ServerValidationError[];
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
                disabled={showVotes || !voting}
              >
                {t('session.showVotes')}
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>

      {openCreateDialog && (
        <CreateVotingDialog
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
