import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, useTheme
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryRow from './CategoryRow';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      // backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  },
  cardStyle: {
    padding: '12px',
  },
  iconInfo: {
    color: '',
  },
}));

const CategoryTable = (props) => {
  const { categoryList,allCategoryList } = props
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const [openCategory, setOpenCategory] = useState(false);

  const handleOnClickDetailCategory = (categoryId) => {
    console.log(categoryId);
    navigate(`/category/detail/${categoryId}`);
  };

  const handleOnClickEditCategory = (categoryId) => {
    navigate(`/category/edit/${categoryId}`);
  };
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {/* <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={selectedAllImportOrders}
                indeterminate={selectedSomeImportOrders}
              />
            </TableCell> */}
            <TableCell padding="checkbox"></TableCell>
            <TableCell>Tên danh mục</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell align="left">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoryList.map((category) => {
            // TODO: làm selectedImportOrders
            //   const isImportOrderSelected = selectedImportOrders.includes(importOrder.id);
            return (
                <CategoryRow key={category.id} category={category} allCategoryList={allCategoryList}/>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
