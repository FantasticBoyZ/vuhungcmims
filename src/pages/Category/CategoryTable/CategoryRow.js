import Popup from '@/components/Common/Popup';
import {
    ArrowDropDownRounded,
    ArrowRightRounded,
    EditTwoTone,
    InfoTwoTone
} from '@mui/icons-material';
import {
    Collapse,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell, TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '@/pages/Category/AddEditCategory/CategoryForm';

const CategoryRow = ({ category }) => {
  const [openNested, setOpenNested] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  //   const subCategory = [
  //     {id:1, name: 'gach men 6x6', description: 'data test'},
  //     {id:2, name: 'gach men 8x8', description: 'data test'},
  //   ]

  const handleClick = () => {
    setOpenNested(!openNested);
  };

  const handleOnClickDetailCategory = (categoryId) => {
    console.log(categoryId);
    navigate(`/category/detail/${categoryId}`);
  };

  const closePopup = () => {
    setOpenPopup(false)
  }

  const handleOnClickEditCategory = () => {
    // navigate(`/category/edit/${categoryId}`);
    setOpenPopup(true)
    console.log(category)
  };

  const renderCategoryRow = (category, childOption) => {
    const { id, name, description, subCategory } = category || {};

    // child option icon is padding left and also can navigate to the page
    const childOptionStyle = childOption ? { pl: 2 } : {};

    // render subCategory
    // if (!subCategory || !subCategory.length) {
    //   return (
    //     // <TableRow
    //     //   sx={childOptionStyle}
    //     //     onClick={childOptionOnClick}
    //     // >
    //     <>
    //       <TableCell>{name}</TableCell>
    //       <TableCell>{description}</TableCell>
    //       <TableCell>Action</TableCell>
    //     </>
    //     // </TableRow>
    //   );
    // }

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
                title="Chi tiết danh mục"
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
                  onClick={() => handleOnClickDetailCategory()}
                >
                  <InfoTwoTone fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Sửa danh mục"
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
                  onClick={() => handleOnClickEditCategory(id)}
                >
                  <EditTwoTone fontSize="small" />
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
                  <TableCell></TableCell>
                  <TableCell colSpan="3">
                    <Collapse in={openNested}>
                      <Table>
                        {/* <TableHead>
                        <TableRow>
                          <TableCell>Tên danh mục phụ</TableCell>

                          <TableCell>
                            Mô tả
                          </TableCell>
                          <TableCell>
                            Hành động
                          </TableCell>
                        </TableRow>
                      </TableHead> */}
                        <TableBody>
                          {subCategory.map((item, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>{item?.name}</TableCell>
                                <TableCell>{item?.description}</TableCell>
                                <TableCell >
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ width: "40px"}}
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
                                        onClick={() => handleOnClickDetailCategory(id)}
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
                                        onClick={() => handleOnClickEditCategory(id)}
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
          category={category}
        />
      </Popup>
      </>
    );
  };
  return <>{renderCategoryRow(category)}</>;
};

export default CategoryRow;
