import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Button, Grid, Toolbar, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

const Main = styled('main')(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

const FlexFilterDrawer = styled(Drawer)(({ theme }) => ({
  width: 'auto',
  flexShrink: 0
}));

export const EntitySelectorView = ({ title, Card, getEntityPath, Filters, options, selectorContext, viewSize }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [loadedOptions, setLoadedOptions] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(0);

  // TODO: reconsider approach below to avoid flicker (since we are clearing all values explicitly)

  // if option list changes we need to reset to ensure only valid data is present
  React.useEffect(() => {
    if (page > 0) {
      setLoadedOptions([]);
      setHasMore(true);
      setPage(0);
    }
  // adding page here will lead to constant resets
  // eslint-disable-next-line
  }, [options]);

  const fetchMoreData = () => {
    const lastIndex = viewSize * (page + 1);
    const items = options.slice(0, lastIndex);
    setLoadedOptions(items);
    setPage((prevPage) => prevPage + 1);
    setHasMore(options.length > lastIndex);
  };

  const handleDrawerClose = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(false);
  };

  const handleDrawerToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const onSelect = (newGameId) => {
    if (newGameId !== null) {
      navigate(getEntityPath(newGameId));
    }
  };

  console.log("EntitySelectorView render")
  console.log("loadedOptions:")
  console.log(loadedOptions)
  console.log("hasMore:")
  console.log(hasMore)
  console.log("page:")
  console.log(page)
  console.log("options:")
  console.log(options)
  return (
    <Container maxWidth='xl'>
      {Filters && <FlexFilterDrawer
        anchor="top"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
      >
        <Filters filterOptions={selectorContext}/>
      </FlexFilterDrawer>}

      <Main>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4" color="text.primary" sx={{ p: theme.spacing(3, 0) }}>
            {title}
          </Typography>
          {Filters && <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={handleDrawerToggle}
            sx={{ m: theme.spacing(0, 1) }}
          >
            Filters
          </Button>}
        </Toolbar>
        <InfiniteScroll
          loadMore={fetchMoreData}
          hasMore={hasMore}
        >
          <Grid container spacing={4}>
            {loadedOptions.map((option) =>
              <Grid key={option.gameId} item sx={{ display: 'flex' }}>
                <Card option={option} onClick={() => onSelect(option.gameId)} />
              </Grid>
            )}
          </Grid>
        </InfiniteScroll>
      </Main>
    </Container>
  );
}