import { Box, Button } from '@mui/material';

interface VoteButtonsGridProps {
  values: string[][];
}

const VoteButtonsGrid = ({ values }: VoteButtonsGridProps) => {
  // return (
  //   <Box
  //     sx={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'end',
  //       alignItems: 'center',
  //       width: '100%',
  //       height: '100%',
  //     }}
  //   >
  //     {values.map((row, index) => {
  //       return (
  //         <Box
  //           key={`row${index}`}
  //           sx={{ display: 'flex', flexDirection: 'row' }}
  //         >
  //           {row.map((value, index2) => {
  //             return (
  //               <Box>
  //                 <Button variant="outlined">{value}</Button>
  //               </Box>
  //             );
  //           })}
  //         </Box>
  //       );
  //     })}
  //   </Box>
  // );

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'center',
      }}
    >
      {values.map((row, idx) => {
        return (
          <Box key={`row${idx}`} sx={{ display: 'flex', flexDirection: 'row' }}>
            {row.map((value, idx2) => {
              return (
                <Box key={`value[${idx},${idx2}]`} sx={{ p: 0.25 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 40,
                      maxWidth: 40,
                      overflow: 'hidden',
                      minHeight: 40,
                      maxHeight: 40,
                    }}
                  >
                    {value}
                  </Button>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default VoteButtonsGrid;
