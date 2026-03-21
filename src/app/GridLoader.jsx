import React from 'react';
import { Grid } from 'react-loader-spinner';

const GridLoader = ({bgHeight}) => {
    return (
        <div className={`flex items-center justify-center ${bgHeight ? bgHeight : null}`}>
            <Grid
                height="80"
                width="80"
                color="rgb(79, 70, 229) "
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
};

export default GridLoader;