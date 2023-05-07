import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { useLocalStorage } from 'core/hooks/useLocalStorage';
import MatrixData from 'matrix/types/MatrixData';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SocketClient from 'session/classes/SocketClient';
import VoteCard from 'session/components/VoteCard';
import SessionData from 'session/types/SessionData';
import SocketSessionData from 'session/types/SocketSessionData';
import SocketSessionJoinUserData from 'session/types/SocketSessionJoinUserData';
import SocketSessionUserData from 'session/types/SocketSessionUserData';
import SocketSessionUserVoteData from 'session/types/SocketSessionUserVoteData';
import SocketSessionVotingData from 'session/types/SocketSessionVotingData';
import { v4 } from 'uuid';
import VotingPanel from './VotingPanel';
import VotingPlayerRow from './VotingPlayerRow';

interface VotingSessionProps {
  user: { id?: string; firstName: string; lastName: string; loggedIn: boolean };
  matrix: MatrixData;
  session: SessionData;
}

const VotingSession = ({ user, matrix, session }: VotingSessionProps) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<SocketSessionUserData[]>([]);
  const [voting, setVoting] = useState<SocketSessionVotingData>();
  const [selectedCard, setSelectedCard] = useState<SocketSessionUserVoteData>();
  const [showVotes, setShowVotes] = useState(false);

  const [socketConnectionId, setSocketConnectionId] = useLocalStorage<string>(
    'connectionId',
    ''
  );
  const socketClient = SocketClient.getInstance(socketConnectionId);

  const handleVotingCreated = (votingData: {
    name: string;
    description?: string;
  }): void => {
    socketClient.createVoting({
      name: votingData.name,
      description: votingData.description,
    } as SocketSessionVotingData);
  };

  const handleVote = (vote: SocketSessionUserVoteData) => {
    try {
      if (getMatrixValue(vote)) {
        socketClient.vote(vote);

        const voteIsSame =
          selectedCard?.row === vote.row && selectedCard.column === vote.column;
        setSelectedCard(voteIsSame ? undefined : vote);
      }
    } catch {}
  };

  const handleShowVotes = () => {
    socketClient.showVotes();
  };

  const handleSessionUpdate = (sessionData: SocketSessionData) => {
    setVoting(sessionData.voting);
    setUsers(sessionData.users);
    setShowVotes(sessionData.showVotes);
  };

  useEffect(() => {
    socketClient.connect();
    socketClient.setupSessionUpdateListener(handleSessionUpdate);

    setSocketConnectionId(user.id ?? v4());

    const userJoinData = {
      firstName: user.firstName,
      lastName: user.lastName,
      connectionId: socketConnectionId,
    } as SocketSessionJoinUserData;

    socketClient.joinSession(session.hashId, userJoinData, handleSessionUpdate);

    return () => {
      socketClient.disconnect();
    };
  }, []);

  const getMatrixValue = (vote: SocketSessionUserVoteData) => {
    try {
      return matrix.values[vote.row][vote.column];
    } catch {
      return null;
    }
  };

  const isAdmin = user.id === session.ownerId;

  const countVotes = () => {
    const res: Record<string, number> = {};

    users.forEach((user) => {
      const matrixValue = user.vote ? getMatrixValue(user.vote) : null;
      if (matrixValue) {
        res[matrixValue] = (res[matrixValue] || 0) + 1;
      }
    });
    return res;
  };

  const sortVotesByCount = () => {
    const votesWithCount = countVotes();
    const totalVotes = Object.keys(votesWithCount).length;

    const unsorted = Object.keys(votesWithCount).map((key) => {
      return {
        value: key,
        count: votesWithCount[key],
        percentage: +((votesWithCount[key] / totalVotes) * 100),
      };
    });
    return unsorted.sort((a, b) => b.count - a.count);
  };

  return (
    <React.Fragment>
      <VotingPanel
        isAdmin={isAdmin}
        voting={voting}
        showVotes={showVotes}
        onCreateSuccess={handleVotingCreated}
        onShowVotes={handleShowVotes}
        sessionHashId={session.hashId}
      />

      {voting && showVotes && (
        <Grid
          container
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {sortVotesByCount().map((vote, idx) => {
            return (
              <Grid item textAlign="center">
                <VoteCard
                  value={vote.value}
                  row={idx}
                  column={0}
                  selected={false}
                  onClick={() => {}}
                ></VoteCard>

                <LinearProgress
                  sx={{
                    mt: 1,
                    color:
                      vote.percentage >= 75
                        ? 'primary.main'
                        : vote.percentage <= 25
                        ? 'error.main'
                        : 'warning.main',
                  }}
                  color="inherit"
                  variant="determinate"
                  value={vote.percentage}
                />

                <Typography component="h4" variant="h4" textAlign="center">
                  {vote.count}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Grid container spacing={5}>
        {voting && !showVotes && (
          <Grid item sx={{ width: 'fit-content', mx: 'auto' }}>
            {matrix.values.map((row, rowIdx) => {
              return (
                <Grid
                  key={`row[${rowIdx}]`}
                  container
                  spacing={{ xs: 0.5, sm: 0.75, lg: 1, xl: 1.25 }}
                  sx={{ mb: 2 }}
                >
                  {row.map((column, columnIdx) => {
                    return (
                      <Grid key={`rowValue[${rowIdx},${columnIdx}]`} item xs>
                        <VoteCard
                          value={column}
                          row={rowIdx}
                          column={columnIdx}
                          selected={
                            rowIdx === selectedCard?.row &&
                            columnIdx === selectedCard.column
                          }
                          onClick={handleVote}
                        ></VoteCard>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })}
          </Grid>
        )}

        <Grid item xs={12} md>
          <Box>
            <Typography component="h2" marginBottom={3} variant="h4">
              {t('session.players')}
            </Typography>
            <Box>
              {users.map((user, index) => {
                return (
                  <VotingPlayerRow
                    key={user.connectionId}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    voted={user.voted}
                    voteValue={
                      user.vote
                        ? getMatrixValue(user.vote) ?? undefined
                        : undefined
                    }
                  />
                );
              })}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default VotingSession;
