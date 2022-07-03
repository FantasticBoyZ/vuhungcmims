import { EditTwoTone, InfoTwoTone } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    '& tbody td': {
      fontWeight: '300',
    },
    // '& tbody tr:hover': {
    //   backgroundColor: '#fffbf2',
    //   cursor: 'pointer',
    // },
  },
  cardStyle: {
    padding: '12px',
  },
}));
const SubCategoryTable = ({ subCategoryList }) => {
  const classes = useStyles();
  const theme = useTheme()

  const handleOnClickDetailSubCategory = (id) => {
    console.log('Detail subcategory ' + id);
  };

  const handleOnClickEditSubCategory = (id) => {
    console.log('Edit subcategory ' + id);
  };
  return (
    <Box>
      <Typography variant="h5">Danh sách danh mục phụ </Typography>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Tên</TableCell>
              <TableCell align="center">Mô tả</TableCell>
              <TableCell >Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategoryList.map((subCategory, index) => {
              //   const isSubProductListSelected = selectedSubProductList.includes(
              //     subProduct.id,
              //   );
              return (
                <TableRow
                  hover
                  key={index}
                  //   selected={isImportOrderSelected}
                  selected={false}
                >
                  <TableCell align="center">{subCategory.name}</TableCell>
                  <TableCell align="center">{subCategory.description}</TableCell>
                  <TableCell >
                    <Stack
                      direction="row"
                      spacing={2}
                    >
                      <Tooltip
                        title="Chi tiết danh mục phụ"
                        arrow
                      >
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.info.lighter,
                            },
                            color: theme.palette.info.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleOnClickDetailSubCategory(subCategory.id)}
                        >
                          <InfoTwoTone fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Sửa danh mục phụ"
                        arrow
                      >
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter,
                            },
                            color: theme.palette.primary.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleOnClickEditSubCategory(subCategory.id)}
                        >
                          <EditTwoTone fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubCategoryTable;
