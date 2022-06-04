import React, { useState } from 'react';
import './Login.css';

import Carousel from 'react-material-ui-carousel';
import { Box, Stack } from '@mui/material';

const LayoutLogin = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      src: 'src/assets/images/image1.png',
      altText: 'Slide 1',
    },
    {
      src: 'src/assets/images/image2.png',
      altText: 'Slide 2',
    },
    {
      src: 'src/assets/images/image3.png',
      altText: 'Slide 3',
    },
  ];

  const handleChange = (cur, prev) => {
    setActiveIndex(cur);
  };

  // const url = items[activeIndex].src
  const slides = items.map((item, i) => {
    return (
      <img
        key={i}
        src={require('src/assets/images/image3.png')}
        alt={item.altText}
      />
    );
  });
  return (
    <>
      <Stack direction="row" >
        <Box className="flexContainer">
          <Box className="flexItemLeft  my__carousel_Stack" sx={{ display: { xs: 'none', md: 'block' } }}>
            <Carousel
              index={activeIndex}
              onChange={handleChange}
              interval={8000}
              animation="slide"
              stopAutoPlayOnHover
              indicators={true}
              swipe
              className="my-carousel"
            >
              {slides}
              {/* {items.map((item, i) => {
                <img
                  key={i}
                  // src={require(item.src)}
                  src="src/assets/images/image3.png"
                  alt={item.altText}
                />;
              })} */}
            </Carousel>
          </Box>
          <Box className="flexItemRight">{children}</Box>
        </Box>
      </Stack>
    </>
  );
};

export default LayoutLogin;
