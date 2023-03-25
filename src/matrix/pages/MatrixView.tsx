import { Box, Grid } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import Toolbar from 'core/components/Toolbar';
import { useGetMatrix } from 'matrix/hooks/useGetMatrix';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const MatrixView = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const { matrixId } = useParams();

  const { data } = useGetMatrix(Number(matrixId), authToken);

  useEffect(() => {
    if (!data) {
      navigate('/404');
    }
  }, [data]);

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar title={data?.name}></Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box>
          {data?.values.map((row, idx1) => {
            return (
              <Grid
                container
                spacing={2}
                className="values-row"
                key={`row[${idx1}]`}
              >
                {row.map((item, idx2) => {
                  return (
                    <Grid item xs key={`item[${idx1},${idx2}]`}>
                      {item}
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default MatrixView;
