import React, { useEffect } from 'react'
import './App.css';
import { useState } from 'react';
import MeasureElement from './MeasureElement';

const FormattedSubs = ({orders, subLegend, animationState}) => {

    // rendering tickets hidden at first described here as foo ticketIds, this has been done to grab the height of the ticket and then rearrange to fit onto A4 paper.
    const [fooTicketIds, setFooTicketIds] = useState([]);
    const [realTicketIds, setRealTicketIds] = useState([]);
    const [fooRendered, setFooRendered] = useState();
    const [printedColdPages, setPrintedColdPages] = useState();
    const [printedHotPages, setPrintedHotPages] = useState();
    const [printedBothPages, setPrintedBothPages] = useState();
    const [allNamesPage, setAllNamesPage] = useState();
    const [registerPage, setRegisterPage] = useState();

    const subAdditionsHelper = (order) => {
        let toAdd = [];
        let xtraCheeseAndMeat = [];
        for (let i = 0; i < order.additions.length; i++) {
            switch (order.additions[i]) {

                case 'extra cheese':
                    xtraCheeseAndMeat.push("x cheese");
                    break;

                case 'extra meat':
                    xtraCheeseAndMeat.push("x meat")
                    break;

                case 'pickle':
                    toAdd.push(["+ pickles", 1]);
                    break;

                case 'banana pepper':
                    toAdd.push(["+ ban peps", 2]);
                    break;

                case 'jalapeno pepper':
                    toAdd.push(["+ jal peps", 3]);
                    break;

                case 'jalapenos': 
                    toAdd.push(["+ jal peps", 3])
                    break;

                case 'mayo':
                    if (order.subNumber != 1) {
                        toAdd.push(["+ mayo", 4])
                    }
                    break;
                
                case 'cherry pepper relish':
                    toAdd.push(["+ cpr", 6]);
                    break;
                
                case 'bacon':
                    if (order.subNumber == 9 || order.subNumber == 8 || order.subNumber == 26) {
                        toAdd.push(["+ bacon", 5]);
                        toAdd.push(["x bacon", 5]);
                    } else if (order.subNumber == 1) {
                        toAdd.push(["x bacon", 5]);
                    } else {
                        toAdd.push(["+ bacon", 5]);
                    }
                    break;

                case 'chipol':
                    toAdd.push(["+ chp mayo", 10]);
                    break;

                case "chipot":
                    toAdd.push(["+ chp mayo", 10]);
                    break;

                case 'mustard': 
                    toAdd.push(["+ yel must", 7]);
                    break;

                case 'brown mustard':
                    toAdd.push(["+ brown must", 8]);
                    break;
                
                case 'spicy mustard':
                    toAdd.push(["+ brown must", 8]);
                    break;

                case 'honey mustard':
                    toAdd.push(["+ honey must", 9]);
                    break;

                case 'port': 
                    if (order.subNumber == 64 || order.subNumber == 65 || order.subNumber == 66) {
                        toAdd.push(["x port", 11]);
                    } else {
                        toAdd.push(["+ port", 11])
                    }
                    break;

                default:
                    console.error("error could not add topping")

            }
        }
        toAdd.sort((a,b) => {
            return a[1] - b[1];
        })

        toAdd = toAdd.map(item => {
            return item[0].toUpperCase();
        })

        let addedToppings = (

                <React.Fragment>
                    {toAdd.map(elem => {
                        return <li className='topping-text'>{elem}</li>
                    })}
                </React.Fragment>
        )

        return {addedToppings: addedToppings, xtraCheeseAndMeat: xtraCheeseAndMeat};
    }

    const formatColdSubs = (order) => {

        let plus = subAdditionsHelper(order);
        let minus;

        // subtractions 
        // checking for blt irregularity 1st
        if (order.subNumber == 1) {
            let natural = ["lettuce", "tomato", "mayo"];
            for (let i = 0; i < order.subtractions.length; i++) {
                if (order.subtractions[i] === "lettuce") {
                    natural.splice(natural.indexOf("lettuce"), 1)
                } else if (order.subtractions[i] === "tomato") {
                    natural.splice(natural.indexOf("tomato"), 1)
                } else if (order.subtractions[i] === "mayo") {
                    natural.splice(natural.indexOf("mayo"), 1)
                }
            }
            minus = (
                <React.Fragment>
                    <li className='mw-text'>Just:</li>
                    {plus.xtraCheeseAndMeat.length > 0 && 
                     plus.xtraCheeseAndMeat.map(elem => {
                        return (<li className='topping-text'>{elem.toUpperCase()}</li>);
                     })}
                    {natural.map(elem => {
                        if (elem === "mayo") elem = "+ mayo";
                        return (<li className='topping-text'>{elem.toUpperCase()}</li>);
                    })}
                </React.Fragment>
            );


        } else {
            let mikesW = [...subLegend.mikesWay];
            let removed = [];
            let count = 0;
            for (let i = 0; i < order.subtractions.length; i++) {
                let subtractedItem = order.subtractions[i];
                for (let j = 0; j < mikesW.length; j++) {
                    if (subtractedItem === mikesW[j]) {
                        removed.push(mikesW[j]);
                        mikesW.splice(j, 1);
                        count++;
                        break;
                    }
                }
                if (subtractedItem === "cheese") {
                    removed.unshift("cheese");
                    mikesW.unshift("cheese");
                    count++;
                }
            }
            if (count !== order.subtractions.length) console.error("not all items subtracted")

            // keeping in style with online orders
            if (removed.length > 3) {
                minus = (
                    <React.Fragment>
                        <li className='mw-text'>Just:</li>
                        {plus.xtraCheeseAndMeat.length > 0 && 
                         plus.xtraCheeseAndMeat.map(elem => {
                            return (<li className='topping-text'>{elem.toUpperCase()}</li>);
                        })}
                        {mikesW.map(elem => {
                            return (<li className='topping-text'>{elem.toUpperCase()}</li>);
                        })}
                    </React.Fragment>
                );
            } else {
                minus = (
                    <React.Fragment>
                        <li className='mw-text'>Mike's Way</li>
                        {plus.xtraCheeseAndMeat.length > 0 && 
                         plus.xtraCheeseAndMeat.map(elem => {
                            return (<li className='topping-text'>{elem.toUpperCase()}</li>);
                        })}
                        {removed.map(elem => {
                            return <li className='topping-text'>- {elem.toUpperCase()}</li>
                        })}
                    </React.Fragment>
                );
            }

        }

        const subSection = (
            <div className='ticket-sub'>
                <p className='ticket-sub-bread'>{order.subSize}<span className='ticket-sub-size'>{order.subBread.toUpperCase()}</span> #{order.subNumber}</p>
                <ul className='ticket-toppings-container'>
                    {minus}
                    {plus.addedToppings}
                </ul>
                <p className='ticket-sub-notes'>{order.notes}</p>
            </div>
        );

        return subSection;
    }

    const formatHotSubs = (order, subLegend) => {

        let plus = subAdditionsHelper(order);

        let minus = (
            <React.Fragment>
                {plus.xtraCheeseAndMeat.length > 0 && 
                 plus.xtraCheeseAndMeat.map(elem => {
                    return (<li className='topping-text'>{elem.toUpperCase()}</li>);
                })}
                {order.subtractions.map(elem => {
                    return <li className='topping-text'>{elem.toUpperCase()}</li>
                })}
            </React.Fragment>
        )


        const subSection = (
            <div className='ticket-sub'>
                <p className='ticket-sub-bread'>{order.subSize}<span className='ticket-sub-size'>{order.subBread.toUpperCase()}</span> #{order.subNumber}</p>
                <ul className='ticket-toppings-container'>
                    {minus}
                    {plus.addedToppings}
                </ul>
                <p className='ticket-sub-notes'>{order.notes}</p>
            </div>
        );

        return subSection;
        
    }

    const formatSideItems = (order) => {
        return (
            <div className='ticket-sub'>
                {order.sideItems.map((item, index) => {
                    return <p key={order.orderName + "sides" + index} className='sides-text'>{item}</p>
                })}
            </div>
        )
    }

    const registerDataHandler = (order) => {
        let thisSubs = [];
        for (let i = 0; i < order.subs.length; i++) {
            let sub = order.subs[i];
            thisSubs.push(`${sub.subSize} ${sub.subNumber}`)
            sub.upCharges.forEach(charge => {
                thisSubs.push(`${charge}`)
            })
        }
        for (let i = 0; i < order.sideItems.length; i++) {
            thisSubs.push(order.sideItems[i]);
        }
        return (
            <div className='register-sub'>
                {thisSubs.map(item => {
                    return <p>{item}</p>
                })}
            </div>
        )
    }
    // looper that formats all orders via helpers
    const formatSubOrders = () => {
        let ordersWithHotOnly = [];
        let ordersWithColdOnly = [];
        let ordersWithBoth = [];
        let localTickets = [];
        let allNames = [];
        let registerData = [];

        for (let i = 0; i < orders.length; i++) {
            let _ = orders[i];
            registerData.push(registerDataHandler(_));
            let name = _.orderName;
            let ldName = _.lunchDropName;
            allNames.push(`${name} -- ${ldName}`);
            let colds = [];
            let hots = [];
            let sides;
            if (orders[i].sideItems.length > 0) {
                sides = formatSideItems(orders[i]);
            }

            for (let j = 0; j < _.subs.length; j++) {
                if (_.subs[j].isColdSub) {
                    colds.push(formatColdSubs(_.subs[j]))
                } else {
                    hots.push(formatHotSubs(_.subs[j]));
                }
            }
            
            let ticketId = name + i + "ticket";

            const wholeTicket = (
                <div id={ticketId} className='ticket-outer'>
                    <h4 className='ticket-name'>{name} <span className='ldName'>{ldName}</span></h4>
                    {colds}
                    {hots}
                    {sides}
                </div>
            )

            if (hots.length > 0) {
                if (colds.length === 0) {
                    ordersWithHotOnly.push(wholeTicket);
                    localTickets.push({type: "hot", id: ticketId, jsx: wholeTicket})
                } else {
                    ordersWithBoth.push(wholeTicket);
                    localTickets.push({type: "both", id: ticketId, jsx: wholeTicket})
                }
            } else {
                ordersWithColdOnly.push(wholeTicket);
                localTickets.push({type: "cold", id: ticketId, jsx: wholeTicket})
            }
        }

        const allPages = (
            <div className='foo-container-hide'>
                <div className='colds-grid'>
                    {ordersWithColdOnly}
                    {ordersWithHotOnly}
                    {ordersWithBoth}
                </div>
            </div>
        )

        const namesPage = (
            <div className='names-box'>
                {allNames.map(name => {
                    return <p>{name}</p>
                })}
            </div>
        )

        const newRegisterPage = (
            <div className='register-body'>
                {registerData}
            </div>
        )

        setFooRendered(allPages);
        setAllNamesPage(namesPage);
        setRegisterPage(newRegisterPage);
        setFooTicketIds(localTickets);
    }

    const constructPagesJSX = (groups) => {

        let coldPages = [];
        let hotPages = [];
        let bothPages = [];

        let target;
        let targetArr;
        let allPages = [];
        let allGroups = [...groups.coldGroups, ...groups.hotGroups, ...groups.bothGroups, ...groups.bothGroups];
        let pageGroup = [];
        for (let i = 0; i < allGroups.length; i++) {
            let curr = allGroups[i];
            let groupHtml = (<div className='ticket-group-strip'>
                {/* <h4 className='ldrop-meta-text no-marg'>Drop: Fr1</h4>
                <h4 className='ldrop-meta-text'>Due: 11:20</h4> */}

                {curr.map(elem => {
                    return elem.jsx;
                })}
            </div>
            )

            pageGroup.push(groupHtml);

            if (pageGroup.length === 3) {
                allPages.push(pageGroup);
                pageGroup = [];
            }

        }
        if (pageGroup.length > 0) allPages.push(pageGroup)

        // for (let index = 0; index < 3; index++) {

        //     let pageGroup = [];

        //     if (index === 0) {
        //         target = groups.coldGroups;
        //         targetArr = coldPages;
        //     } else if (index === 1) {
        //         target = groups.hotGroups;
        //         targetArr = hotPages;
        //     } else {
        //         target = groups.bothGroups;
        //         targetArr = bothPages;
        //     }

        //     for (let i = 0; i < target.length; i++) {
        //         let curr = target[i];
        //         let groupHtml = (<div className='ticket-group-strip'>
        //             {/* <h4 className='ldrop-meta-text no-marg'>Drop: Fr1</h4>
        //             <h4 className='ldrop-meta-text'>Due: 11:20</h4> */}

        //             {curr.map(elem => {
        //                 return elem.jsx;
        //             })}
        //         </div>
        //         )
    
        //         pageGroup.push(groupHtml);
    
        //         if (pageGroup.length === 3) {
        //             targetArr.push(pageGroup);
        //             pageGroup = [];
        //         }
    
        //     }
        //     if (pageGroup.length > 0) targetArr.push(pageGroup)
        // }

        setPrintedColdPages(allPages)
        // setPrintedHotPages(hotPages);
        // setPrintedBothPages(bothPages);

    }

    const createTicketStrips = () => {
        const ticketIds = [...realTicketIds]
        const stripHeight = 1100;
        let coldStrips = [];
        let hotStrips = [];
        let bothStrips = [];
        ticketIds.forEach(tick => {
            if (tick.type === "cold") {
                coldStrips.push(tick);
            } else if (tick.type === "hot") {
                hotStrips.push(tick);
            } else {
                bothStrips.push(tick);
            }
        })

        let coldGroups = [];
        let hotGroups = [];
        let bothGroups = [];

        let target;
        let targetArr;

        for (let index = 0; index < 3; index++) {

            let remaining = stripHeight;
            let currGroup = [];

            if (index === 0) {
                target = coldStrips;
                targetArr = coldGroups;
            } else if (index === 1) {
                target = hotStrips;
                targetArr = hotGroups;
            } else {
                target = bothStrips;
                targetArr = bothGroups;
            }

            for (let i = 0; i < target.length; i++) {
                let currTick = target[i];
                remaining -= currTick.height;
                if (remaining < 0) {
                    targetArr.push(currGroup);
                    currGroup = [currTick];
                    remaining = stripHeight - currTick.height;
                } else {
                    currGroup.push(currTick)
                }
            }
            if (currGroup.length > 0) {
                targetArr.push(currGroup);
            }
        }

        constructPagesJSX({hotGroups: hotGroups, coldGroups: coldGroups, bothGroups: bothGroups});
    }

    useEffect(() => {
        formatSubOrders();
    }, [orders])

    // this hook handles the measuring of tickets via hidden rendering.

    useEffect(() => {
        if (fooTicketIds.length === 0) return;

        let realTickets = [];
        for (let i = 0; i < fooTicketIds.length; i++) {
            let pushObj = {...fooTicketIds[i]}
            let elem = document.getElementById(fooTicketIds[i].id);
            pushObj.height = elem.offsetHeight;

            realTickets.push(pushObj);
        }
        setRealTicketIds(realTickets);

    }, [fooTicketIds])

    // this hook calls to action the actual rendering

    useEffect(() => {

        if (realTicketIds.length > 0) {
            createTicketStrips();
        }

    }, [realTicketIds])

  return (
    <div className={animationState === "complete" ? "showTickets" : "hideTickets"}>
        {/* <div className='page'></div> */}
        <div className='all-pages-preview'>
            {printedColdPages && 
            printedColdPages.map((page, index) => {
                return (
                    <div className={index === 0 ? "last-page" : "page"}>
                        {page.map(strip => {
                            return strip;
                        })}
                    </div>
                )
            })
            }
            {allNamesPage && 
                <div className='page'>
                    {allNamesPage}
                </div>
            }
            {registerPage && 
                <div className='page'>
                    {registerPage}
                </div>
            }
            {/* {printedHotPages && 
            printedHotPages.map(page => {
                return (
                    <div className='page'>
                        {page.map(strip => {
                            return strip;
                        })}
                    </div>
                )
            })
            }
            {printedBothPages && 
            printedBothPages.map(page => {
                return (
                    <div className='page'>
                        {page.map(strip => {
                            return strip;
                        })}
                    </div>
                )
            })
            }
            {printedBothPages && 
            printedBothPages.map(page => {
                return (
                    <div className='page'>
                        {page.map(strip => {
                            return strip;
                        })}
                    </div>
                )
            }) */}
            {/* } */}
        </div>
        {fooRendered}
    </div>
  )
}

export default FormattedSubs