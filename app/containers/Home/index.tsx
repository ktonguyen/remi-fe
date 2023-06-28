import React, { useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import {  Grid, Stack, Card, CardContent, Link, Avatar, Box, Typography, LinearProgress } from '@mui/material';
import ReactPlayer from 'react-player/youtube';
import { fDate } from '../../../utils/formatTime';
import { BroadcastContext } from 'BroadcastContext';

const StyledTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
});
function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}
  
function stringAvatar(name: string) {
return {
    sx: {
    bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}`,
};
}

function VideosPage() {
  const broadcastContext = useContext(BroadcastContext);
  const { broadcastValue } = broadcastContext || {};
  const [clientSideTotal, setClientSideTotal] = React.useState(0); 
  const [serverSideTotal, setServerSideTotal] = React.useState(0);
  const [allVideos , setAllVideos] = React.useState([]);
  const setUpData = (data: any, append: boolean) => {
    setAllVideos((prev) => {
        let newData = [];
        if(append) {
            newData = [...prev, ...data];
        } else {
            newData = [...data, ...prev];
        }
        const key= "id";
        const arrayUniqueByKey = [...new Map(newData.map(item =>
            [item[key], item])).values()];
        setClientSideTotal(arrayUniqueByKey.length ?? 0); 
        return arrayUniqueByKey;
    });
    if(!append) {
        setServerSideTotal((serverSideTotal) => serverSideTotal + data.length);
    }
    
  }
  const getData = async () => {
    const res = await fetch("/api/videos", {
        method: 'POST',
        body: JSON.stringify({offset: allVideos.length, limit: 10}),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json();
    setUpData(data?.videos, true);
    setServerSideTotal(data?.total);
  };
  useEffect(() => {
    getData();
  },[]);
  useEffect(() => {
    console.log("broadcastValue", broadcastValue)
    if(broadcastValue && broadcastValue?.id) {
        setUpData([broadcastValue], false);
    }
    
  },[broadcastValue]);
  return (
    <>
        <InfiniteScroll
        style={{
            overflowY: 'hidden',
            overflowX: 'hidden',
            width: '100% !important',
        }}
        loader={<></>}
        dataLength={allVideos.length}
        next={() => {
            getData();
        }}
        hasMore={serverSideTotal > clientSideTotal}>
            <Box sx={{ width: '100%' }}>
                <Stack spacing={3} sx={{ width: "100%" }}>
                {allVideos.map((video: any, index) => (
                    <Grid item xs={12} md={12} key={index}>
                        <Card>
                            <CardContent>
                                <ReactPlayer url={video?.url} width="100%"  style={{ objectFit: 'cover'}} controls={false} />
                                <StyledTitle
                                    color="inherit"
                                    variant="subtitle2"
                                    underline="hover" >
                                    {video?.title}
                                </StyledTitle>
                                <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                    {fDate(video?.createdAt, "dd MMM yyyy")}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems={"center"}>
                                    <Avatar {...stringAvatar(video.shareBy || "")} />
                                    <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled' }}>
                                        {video?.shareBy}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                </Stack>
            </Box>
        </InfiniteScroll>
    </>
  );
}
export default VideosPage;
