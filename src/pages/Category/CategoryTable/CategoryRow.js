import Popup from '@/components/Common/Popup';
import {
  ArrowDropDownRounded,
  ArrowRightRounded,
  Edit,
  EditTwoTone,
  Info,
  InfoTwoTone,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '@/pages/Category/AddEditCategory/CategoryForm';
import AlertPopup from '@/components/Common/AlertPopup';

const useStyles = makeStyles({
  tableCellChild: {
    padding: '0 !important',
  },
});

const CategoryRow = (props) => {
  const { category, allCategoryList, searchCategory } = props;
  const classes = useStyles();
  const [openNested, setOpenNested] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupDescription, setOpenPopupDescription] = useState(false);
  const [editCategory, setEditCategory] = useState();
  const [title, setTitle] = useState()
  const [message, setMessage] = useState()
  //   const subCategory = [
  //     {id:1, name: 'gach men 6x6', description: 'data test'},
  //     {id:2, name: 'gach men 8x8', description: 'data test'},
  //   ]
  const subCategoryTest = {
    categoryName: 'Gach',
    description: 'Hang đep',
    id: 1,
    name: 'Gach',
    categoryId: 1,
  };
  const handleClick = () => {
    setOpenNested(!openNested);
  };

  const handleOnClickDetailCategory = (description) => {
    setTitle('Mô tả danh mục')
    setMessage(description)
    setOpenPopupDescription(true)
  };

  const closePopup = () => {
    setOpenPopup(false);
    searchCategory()
  };

  const handleOnClickEditCategory = (item) => {
    // navigate(`/category/edit/${categoryId}`);
    setEditCategory(item);
    setOpenPopup(true);
  };

  const renderCategoryRow = (category, childOption) => {
    const { id, name, description, subCategory } = category || {};

    // child option icon is padding left and also can navigate to the page
    const childOptionStyle = childOption ? { pl: 2 } : {};

    // render parent option
    return (
      <>
        <TableRow>
          <TableCell>
            {!!subCategory && subCategory.length > 0 && (
              <>
                {openNested ? (
                  <ArrowDropDownRounded onClick={() => setOpenNested(false)} />
                ) : (
                  <ArrowRightRounded onClick={() => setOpenNested(true)} />
                )}
              </>
            )}
          </TableCell>
          <TableCell>
            <Typography
              variant="body1"
              color="text.primary"
              gutterBottom
              noWrap
            >
              {name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body1"
              color="text.primary"
              gutterBottom
              noWrap
            >
              {description}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Stack
              direction="row"
              spacing={2}
            >
              <Tooltip
                title="Mô tả"
                arrow
              >
                <IconButton
                  sx={{
                    '&:hover': {
                      background: 'rgba(255, 245, 0,0.1)',
                    },
                    color: '#FFF500',
                  }}
                  color="inherit"
                  size="small"
                  onClick={() => handleOnClickDetailCategory(description)}
                >
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Chỉnh sửa"
                arrow
              >
                <IconButton
                  sx={{
                    '&:hover': {
                      background: theme.colors.warning.lighter,
                    },
                    color: theme.palette.warning.main,
                  }}
                  color="warning"
                  size="small"
                  onClick={() => handleOnClickEditCategory(category)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        </TableRow>
        {!!subCategory && subCategory.length > 0 && (
          <>
            {openNested && (
              <>
                <TableRow>
                  <TableCell className={classes.tableCellChild}></TableCell>
                  <TableCell
                    className={classes.tableCellChild}
                    colSpan="3"
                  >
                    <Collapse in={openNested}>
                      <Table>
                        <TableBody>
                          {subCategory.map((item, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell width="30%"><Stack ml={2}>{item?.name}</Stack></TableCell>
                                <TableCell width="50%"><Stack ml={2}>{item?.description}</Stack></TableCell>
                                <TableCell width="20%">
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ width: '40px' }}
                                  >
                                    <Tooltip
                                      title="Mô tả"
                                      arrow
                                    >
                                      <IconButton
                                        sx={{
                                          '&:hover': {
                                            background: 'rgba(255, 245, 0,0.1)',
                                          },
                                          color: '#FFF500',
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => handleOnClickDetailCategory(item?.description)}
                                      >
                                        <InfoTwoTone fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                      title="Chỉnh sửa"
                                      arrow
                                    >
                                      <IconButton
                                        sx={{
                                          '&:hover': {
                                            background: theme.colors.warning.lighter,
                                          },
                                          color: theme.palette.warning.main,
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => handleOnClickEditCategory(item)}
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            )}
          </>
        )}
        <Popup
          title="Sửa danh mục"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <CategoryForm
            closePopup={closePopup}
            category={editCategory}
            allCategoryList={allCategoryList}
          />
        </Popup>
        <AlertPopup
          maxWidth="sm"
          title={title}
          openPopup={openPopupDescription}
          setOpenPopup={setOpenPopupDescription}
          isConfirm={false}
        >
          <Box
            component={'span'}
            className="popupMessageContainer"
          >
            {message}
          </Box>
        </AlertPopup>
      </>
    );
  };
  return <>{renderCategoryRow(category)}</>;
};

export default CategoryRow;
