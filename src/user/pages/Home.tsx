import { Card, CardContent, Grid, Typography } from '@mui/material';
import { ReactComponent as CreateMatrixSvg } from 'assets/createMatrix.svg';
import { ReactComponent as CreateSessionSvg } from 'assets/createSession.svg';
import { ReactComponent as InviteSvg } from 'assets/invite.svg';
import { ReactComponent as VoteSvg } from 'assets/vote.svg';
import { ReactComponent as WelcomeSvg } from 'assets/welcome.svg';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import SvgContainer from 'core/components/SvgContainer';
import Toolbar from 'core/components/Toolbar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import HomeWidget from 'user/components/HomeWidget';

const Home = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar />
      </AppBar>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={{ backgroundColor: 'transparent', mb: 2 }}>
            <CardContent>
              <Typography component="div" gutterBottom variant="h1">
                {t('home.welcome.title', { name: userData?.firstName })}
              </Typography>

              <Typography
                component="div"
                sx={{ fontWeight: 300, mb: 3 }}
                variant="h1"
              >
                {t('home.welcome.subTitle')}
              </Typography>

              <Typography
                color="textSecondary"
                component="p"
                gutterBottom
                marginBottom={2}
                variant="subtitle1"
              >
                {t('home.welcome.message')}
              </Typography>

              <SvgContainer>
                <WelcomeSvg />
              </SvgContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <HomeWidget
                svg={<CreateMatrixSvg height={125} width="auto" />}
                title={`1. ${t('home.widgets.createMatrix.title')}`}
                subTitle={t('home.widgets.createMatrix.subTitle')}
                onClick={() => navigate('/matrices')}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <HomeWidget
                svg={<CreateSessionSvg height={150} width="auto" />}
                title={`2. ${t('home.widgets.createSession.title')}`}
                subTitle={t('home.widgets.createSession.subTitle')}
                onClick={() => navigate('/sessions')}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <HomeWidget
                svg={<InviteSvg height={122} width="auto" />}
                title={`3. ${t('home.widgets.invite.title')}`}
                subTitle={t('home.widgets.invite.subTitle')}
                onClick={() => navigate('/sessions')}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <HomeWidget
                svg={<VoteSvg height={150} width="auto" />}
                title={`4. ${t('home.widgets.vote.title')}`}
                subTitle={t('home.widgets.vote.subTitle')}
                onClick={() => navigate('/sessions')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Home;
