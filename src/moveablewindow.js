import React from 'react';

class Movable extends React.Component {
    render() { 
        // this.props.children accepts child elements.

        return(
            <div
                className={"moveable " + this.props.className}
                style={this.props.style}
                onMouseDown={(id)=>this.props.callback(this.props.id)}
                //onTouchStart={(id)=>this.props.callback(this.props.id)}
            >
                 {this.props.children}  
            </div>
        );

    }
}

export {Movable};