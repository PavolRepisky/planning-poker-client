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
import SocketSessionUserVoteData from 'session/types/SocketSessionUserVoteData';
import SocketSessionVotingData from 'session/types/SocketSessionVotingData';
import VotingPanel from './VotingPanel';
import VotingPlayerRow from './VotingPlayerRow';

interface VotingSessionProps {
  user: { id?: string; firstName: string; lastName: string; loggedIn: boolean };
  matrix: MatrixData;
  session: SessionData;
}

const VotingSession = ({ user, matrix, session }: VotingSessionProps) => {
  const { t } = useTranslation();
  const [socketSessionData, setSocketSessionData] = useState<SocketSessionData>(
    {
      users: [],
    }
  );
  const [selectedCard, setSelectedCard] = useState<SocketSessionUserVoteData>();

  const [socketConnectionId] = useLocalStorage<string>('connectionId', '');

  const socketClient = SocketClient.getInstance();

  const handleVotingCreated = (votingData: SocketSessionVotingData): void => {
    socketClient.createVoting(votingData);
  };

  const handleVote = (vote: SocketSessionUserVoteData) => {
    try {
      if (getMatrixValue(vote)) {
        socketClient.vote(vote);

        const votedTwice =
          selectedCard?.row === vote.row && selectedCard.column === vote.column;
        setSelectedCard(votedTwice ? undefined : vote);
      }
    } catch {}
  };

  const handleShowVotes = () => {
    socketClient.showVotes();
  };

  const handleSessionUpdate = (sessionData: SocketSessionData) => {
    setSocketSessionData(sessionData);
  };

  const handleVoteUpdate = (voteData: SocketSessionUserVoteData | null) => {
    if (voteData && getMatrixValue(voteData)) {
      setSelectedCard(voteData);
    }
  }

  const handleJoin = (data: {
    sessionData: SocketSessionData;
    userVote: SocketSessionUserVoteData | null;
  }) => {
    handleSessionUpdate(data.sessionData);
    handleVoteUpdate(data.userVote);
  };

  useEffect(() => {
    socketClient.connect();
    socketClient.setupSessionUpdateListener(handleSessionUpdate);
    socketClient.setupVoteUpdateListener(handleVoteUpdate)

    const userJoinData = {
      firstName: user.firstName,
      lastName: user.lastName,
      connectionId: socketConnectionId,
    } as SocketSessionJoinUserData;

    socketClient.joinSession(session.hashId, userJoinData, handleJoin);

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

    if (!socketSessionData.votes) {
      return {};
    }

    for (const voteData of Object.values(socketSessionData.votes)) {
      const matrixValue = getMatrixValue(voteData);
      if (matrixValue) {
        res[matrixValue] = (res[matrixValue] || 0) + 1;
      }
    }
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
        voting={socketSessionData.voting}
        showVotes={socketSessionData.votes !== undefined}
        onCreateSuccess={handleVotingCreated}
        onShowVotes={handleShowVotes}
        sessionHashId={session.hashId}
      />

      {socketSessionData.votes && (
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
        {socketSessionData.voting && socketSessionData.votes === undefined && (
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
              {socketSessionData.users.map((user, index) => {
                return (
                  <VotingPlayerRow
                    key={user.connectionId}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    voted={user.voted}
                    voteValue={
                      socketSessionData.votes
                        ? getMatrixValue(
                            socketSessionData.votes[user.connectionId]
                          ) ?? undefined
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
