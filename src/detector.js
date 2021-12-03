import React from 'react';

function Detector(props){
    return (
        <div
            className="detector"
            onMouseUp={(x,y) => props.callback(props.x, props.y)}
            //onTouchUp={(x,y) => props.callback(props.x, props.y)}
            style={props.style}
        />

    );
}

export {Detector};