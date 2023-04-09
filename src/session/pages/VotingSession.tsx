import { Check as CheckIcon, Person as PersonIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import Toolbar from 'core/components/Toolbar';
import { useLocalStorage } from 'core/hooks/useLocalStorage';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import VoteCard from 'session/components/VoteCard';
import { useJoinSession } from 'session/hooks/useJoinSession';
import UserData from 'session/types/UserData';
import VoteCardData from 'session/types/VoteCardData';
import socketManager from 'session/utils/SocketManager';
import * as uuid from 'uuid';

const VotingSession = () => {
  const navigate = useNavigate();
  const { authToken, userData } = useAuth();
  const { hashId } = useParams();
  const { t } = useTranslation();
  const theme = useTheme();

  const [selectedCard, setSelectedCard] = useState<null | VoteCardData>(null);
  const [users, setUsers] = useState<UserData[]>();
  const [socketSessionId, setSocketSessionId] = useLocalStorage<string | null>(
    'socketSessionId',
    null
  );

  const { data } = useJoinSession({
    hashId: hashId || '',
    authToken,
  });

  const setSessionUsers = (users: UserData[]) => {
    setUsers(users);
    const currentUserData = users.find(
      (user) => user.socketSessionId === socketSessionId
    );
    setSelectedCard(currentUserData ? currentUserData.vote : null);
  };

  const handleVote = (row: number, column: number) => {
    if (socketSessionId) {
      socketManager.emitVote({ row, column } as VoteCardData);
    }
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    socketManager.connect();
    socketManager.setupUsersListener(setSessionUsers);

    if (!socketSessionId) {
      setSocketSessionId(uuid.v4());
    }

    const newUserData = {
      firstName: userData!.firstName,
      lastName: userData!.lastName,
      vote: null,
      socketSessionId,
    } as UserData;

    socketManager.emitJoinSession(data.session.hashId, newUserData);

    return () => {
      socketManager.disconnect();
    };
  }, []);

  if (!data) {
    navigate('/400');
    return null;
  }

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={data.session.name}></Toolbar>
      </AppBar>

      <Card sx={{ mb: 5 }}>
        <CardHeader title={'Story'}></CardHeader>
        <CardContent>

        </CardContent>
        <CardActions>
          <Button variant="contained" sx={{ mr: { xs: 1, md: 2 } }}>
            {t('session.voting.newVoting')}
          </Button>
          <Button variant="outlined">{t('session.voting.showVotes')}</Button>
        </CardActions>
      </Card>

      <Grid container spacing={5}>
        <Grid item sx={{ width: 'fit-content', mx: 'auto' }}>
          {data.matrix.values.map((row, rowIdx) => {
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
                          selectedCard !== null &&
                          rowIdx === selectedCard.row &&
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
        <Grid item xs={12} md>
          <Box>
            <Typography component="h2" marginBottom={3} variant="h4">
              {t('session.voting.players')}
            </Typography>
            <Box>
              {users?.map((user, index) => {
                return (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        <PersonIcon />
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography component="div" variant="h6">
                          {`${user.firstName} ${user.lastName}`}
                        </Typography>
                      </Box>
                      {user.vote && <CheckIcon color="success" />}
                    </CardContent>
                  </Card>
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
