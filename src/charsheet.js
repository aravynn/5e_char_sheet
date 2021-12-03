import React from 'react';
import {Movable} from './moveablewindow';
import {Detector} from './detector';

class CharacterSheet extends React.Component {
    constructor(props){
        super(props);

        // determine default page sizeing for movable.
        const ws = this.getWindowSizing();
        const sz = this.getColRowSettings("WEB", ws, 150);

        // calculate starter state
        this.state = {
            editMode : true,    // allow movement and edits for moveables.
            pageStyle : "WEB",  // set as WEB for any size page, or PRINT for a print format.
            size : ws,
            pageSize : sz,
            squareSize : 150,
            placements : [
                {x:0, y:0, w:1, h:1, content:"0011"},
                {x:0, y:1, w:1, h:1, content:"0111"},
                {x:1, y:0, w:3, h:2, content:"1023"},
                {x:0, y:2, w:4, h:1, content:"2014"},
                {x:0, y:3, w:2, h:1, content:"3012"},
                {x:2, y:3, w:2, h:1, content:"3212"},
            ],     // moveables and their contents stored here, as x,y,w,h,content
            activeIndex : null,
            character : {
                // character data, later will be read into memory.
            }
        };

        //const col = this.state.pageSize.columns;
        //const row = this.state.pageSize.rows;

        
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }
  
    componentWillUnmount(){
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        // determine the current window size, and update as required.

        const ws = this.getWindowSizing();
        const sz = this.getColRowSettings(this.state.pageStyle, ws, this.state.squareSize);

        this.setState({ 
            size: ws,
            pageSize : sz
        });
    }

    clickMovable = (id) => {
        //alert("id: " + id);
        this.setState({activeIndex : id});   
    }

    getWindowSizing = () => {
        return {
            w : window.innerWidth,
            h : window.innerHeight
        };
    }

    getColRowSettings = (style, ws, squareSize) => {
        let cols = 0;

        if(style === "WEB"){
            cols = 12;
            if(ws.w/cols < squareSize){
                // this is at web 600 wide. 
                cols = Math.floor(ws.w/squareSize);
            }
        } else {
            cols = 6;
        }

        let rows = Math.floor(ws.h / squareSize);//Math.ceil(cols * ws.h / ws.w);

        if(style === "PRINT"){
            rows = 9; // assumed default value.
        }

        return {
            columns : cols,
            rows : rows
        };
    }

    detect = (x,y)=>{
        const active = this.state.activeIndex;
        let sq = this.state.placements.slice();
        if(x + sq[active].w > this.state.pageSize.columns){
            x -= x + sq[active].w - this.state.pageSize.columns;
        }
        sq[active].x = x;
        if(y + sq[active].h > this.state.pageSize.rows){
            y -= y + sq[active].h - this.state.pageSize.rows;
        }
        
        sq[active].y = y;

        this.setState({
            placements : sq,
            activeIndex : null
        });
    }

    render() {
        let moveSize = {
            width: this.state.squareSize,//this.state.size.w / this.state.pageSize.columns,
            height: this.state.squareSize//this.state.size.h / this.state.pageSize.rows
        }

        const obj = this.state.placements.slice().map((data, index) =>{
            let top = data.y * moveSize.width;
            let left = data.x * moveSize.height;
            let width = moveSize.width * data.w;
            let height = moveSize.height * data.h;
            return(
                <Movable
                    key={index}
                    callback={(id) => this.clickMovable(id)}
                    id={index}
                    style={{
                        top: top,
                        left: left,
                        width: width,
                        height: height
                    }}
                >
                    {data.content}
                </Movable>
            );
        });

        
        let clickmap = [];
        for(let y = 0; y < this.state.pageSize.rows; y++){
            for(let x = 0; x < this.state.pageSize.columns; x++){
                let top = y * moveSize.width;
                let left = x * moveSize.height;
                let width = moveSize.width;
                let height = moveSize.height;
                
                clickmap.push(<Detector 
                    key = {x + 'k' + y}
                    x={x}
                    y={y}
                    style={{
                        top: top,
                        left: left,
                        width: width,
                        height: height
                    }}
                    callback={(x,y) => this.detect(x,y)}
                />);
            }
        }


        return (
            /* 
                onMouseUp={this.finishMove}
                onTouchEnd={this.finishMove}
            */

            <div
                style={{
                    userSelect: "none"
                }}
            >
                {obj}
                {this.state.activeIndex !== null && clickmap}
                <Movable
                    style = {moveSize}
                >
                    <h3>Content</h3>
                    <p>{this.state.pageSize.columns} W x {this.state.pageSize.rows} H</p>
                    <p>{this.state.size.w} w x {this.state.size.h} H</p>
                    <p>{moveSize.width * this.state.pageSize.columns} w x {moveSize.height * this.state.pageSize.rows} H</p>
                </Movable>
            </div>
        );
    }
}

export default CharacterSheet;