import { Star as StarIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Feature from 'core/components/Feature';
import LandingLayout from 'core/components/LandingLayout';
import { useSettings } from 'core/contexts/SettingsProvider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import JoinSessionDialog from 'session/components/JoinSessionDialog';

const listFeatures = [
  { name: 'landing.features.unlimitedSessions' },
  { name: 'landing.features.unlimitedUsers' },
  { name: 'landing.features.unlimitedVotings' },
  { name: 'landing.features.noPersonalDetails' },
];

const Landing = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const { mode } = useSettings();

  return (
    <LandingLayout>
      <main>
        <Box
          sx={{
            py: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              variant="h1"
              align="center"
              color="text.primary"
              marginBottom={4}
            >
              {t('landing.title')}
            </Typography>

            <Stack
              sx={{ pt: 3 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={() => setOpenJoinDialog(true)}
              >
                {t('landing.join')}
              </Button>
            </Stack>
          </Container>
        </Box>

        {openJoinDialog && (
          <JoinSessionDialog
            onClose={() => setOpenJoinDialog(false)}
            open={openJoinDialog}
          />
        )}

        <Container sx={{ py: 6 }} maxWidth="md">
          <img
            alt={t('landing.altDemo')}
            src={`images/demo_${mode}_${i18n.language}.png`}
            style={{
              borderRadius: 24,
              borderStyle: 'solid',
              borderWidth: 6,
              borderColor: theme.palette.background.default,
              width: '100%',
            }}
          />
        </Container>

        <Container sx={{ py: 8 }} maxWidth="lg">
          <Box>
            <Feature
              title={t('landing.features.builder.title')}
              description={t('landing.features.builder.description')}
              rightAlign={false}
              imageSrc={`images/matrix_editor_${mode}_${i18n.language}.png`}
              imageAlt={t('landing.features.builder.imgAlt')}
            />
            <Feature
              title={t('landing.features.realTime.title')}
              description={t('landing.features.realTime.description')}
              rightAlign={true}
              imageSrc={`images/real_time_voting_${mode}_${i18n.language}.png`}
              imageAlt={t('landing.features.realTime.imgAlt')}
            />
            <Feature
              title={t('landing.features.inGameVoting.title')}
              description={t('landing.features.inGameVoting.description')}
              rightAlign={false}
              imageSrc={`images/in-game_voting_${mode}_${i18n.language}.png`}
              imageAlt={t('landing.features.inGameVoting.imgAlt')}
            />
            <Feature
              title={t('landing.features.matrixManagement.title')}
              description={t('landing.features.matrixManagement.description')}
              rightAlign={true}
              imageSrc={`images/matrix_management_${mode}_${i18n.language}.png`}
              imageAlt={t('landing.features.matrixManagement.imgAlt')}
            />
          </Box>
        </Container>

        <Container sx={{ pt: 5 }} maxWidth="md">
          <Stack alignItems="center">
            <Typography
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {t('landing.features.noLimits')}
            </Typography>

            <List sx={{ pt: 3 }}>
              {listFeatures.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      <StarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={t(feature.name)} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', mt: 5 }}>
              <Button
                component={Link}
                href={process.env.REACT_APP_API_SOURCE_LINK}
                rel="noopener noreferrer"
                target="_blank"
                variant="outlined"
                sx={{ mr: 2 }}
                role="link"
              >
                {t('landing.links.api')}
              </Button>

              <Button
                component={Link}
                href={process.env.REACT_APP_CLIENT_SOURCE_LINK}
                rel="noopener noreferrer"
                target="_blank"
                variant="outlined"
                role="link"
              >
                {t('landing.links.client')}
              </Button>
            </Box>
          </Stack>
        </Container>
      </main>
    </LandingLayout>
  );
};

export default Landing;
