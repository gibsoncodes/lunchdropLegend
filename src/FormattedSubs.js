import React, { useEffect } from 'react'
import './App.css';
import { useState } from 'react';
import MeasureElement from './MeasureElement';

const FormattedSubs = ({orders, subLegend}) => {
    console.log(subLegend)

    const [currMeasuredElem, setCurrMeasuredElem] = useState();
    const [heightsOfTickets, setHeightsOfTickets] = useState([]);

    let ticketIds = [];

    // useEffect(() => {
    //     console.log(heightsOfTickets)
    // }, [heightsOfTickets])

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

    // const getPrintablePages = (ordersWithColdOnly, ordersWithHotOnly, ordersWithBoth) => {
    //     let cPages = [];
    //     let hPages = [];
    //     let chPages = [];

    //     let remainingHeight = 297;
    //     let stripId = 0;
    //     setCurrMeasuredElem(ordersWithColdOnly[1])
    //     // for (let i = 0; i < ordersWithColdOnly.length; i++) {
    //     // }
    //     return {cPages: cPages, hPages: hPages, chPages: chPages};
    // }

    

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

    // looper that formats all orders via helpers
    const formatSubOrders = (orders) => {
        let ordersWithHotOnly = [];
        let ordersWithColdOnly = [];
        let ordersWithBoth = [];

        for (let i = 0; i < orders.length; i++) {
            let _ = orders[i];
            let name = _.orderName;
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
                    <h4 className='ticket-name'>{name}</h4>
                    {colds}
                    {hots}
                    {sides}
                </div>
            )
            if (hots.length > 0) {
                if (colds.length === 0) {
                    ordersWithHotOnly.push(wholeTicket);
                } else {
                    ordersWithBoth.push(wholeTicket);
                }
            } else {
                ordersWithColdOnly.push(wholeTicket);
            }
        }

        // const printablePages = getPrintablePages(ordersWithColdOnly, ordersWithHotOnly, ordersWithBoth);

        const coldSubPage = (
            <div className='page'>
                <h2 className='colds-page-header'>Cold Subs</h2>
                <div className='colds-grid'>
                    {ordersWithColdOnly}
                </div>
            </div>
        )

        const hotSubPage = (
            <div className='page'>
                <h2 className='colds-page-header'>Hot Subs</h2>
                <div className='colds-grid'>
                    {ordersWithHotOnly}
                </div>
            </div>
        )
        const bothSubPage = (
            <div className='page'>
                <h2 className='colds-page-header'>Cold + Hot Orders</h2>
                <div className='colds-grid'>
                    {ordersWithBoth}
                </div>
            </div>
        )
        const allPages = (
            <div className='all-pages-outer'>
                <div className='foo-container-hide'>
                    {ordersWithColdOnly}
                    {ordersWithHotOnly}
                    {ordersWithBoth}
                </div>
            </div>
        )

        return allPages;

    }
    let main = formatSubOrders(orders);

    useEffect(() => {
        for (let i = 0; i < ticketIds.length; i++) {
            let elem = document.getElementById(ticketIds[i]);
            
        }
    })

  return (
    <div>
        {main}
        <h1>poopy diapers</h1>
    </div>
  )
}

export default FormattedSubs