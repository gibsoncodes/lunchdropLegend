import React from 'react'
import './App.css';

const FormattedSubs = ({orders, subLegend}) => {
    console.log(subLegend)

    const subAdditionsHelper = (order) => {
        console.log(order.additions)
        let toAdd = [];
        for (let i = 0; i < order.additions.length; i++) {
            switch (order.additions[i]) {

                case 'extra cheese':
                    toAdd.push("x cheese");
                    break;

                case 'extra meat':
                    toAdd.push("x meat")
                    break;

                case 'pickle':
                    toAdd.push("+ pickles");
                    break;

                case 'banana pepper':
                    toAdd.push("+ ban peps");
                    break;

                case 'jalapeno pepper':
                    toAdd.push("+ jal peps");
                    break;

                case 'jalapenos': 
                    toAdd.push("+ jal peps")
                    break;

                case 'mayo':
                    if (order.subNumber != 1) {
                        toAdd.push("+ mayo")
                    }
                    break;
                
                case 'cherry pepper relish':
                    toAdd.push("+ cpr");
                    break;
                
                case 'bacon':
                    if (order.subNumber == 9 || order.subNumber == 8 || order.subNumber == 26) {
                        toAdd.push("+ bacon");
                        toAdd.push("x bacon");
                    } else if (order.subNumber == 1) {
                        toAdd.push("x bacon");
                    } else {
                        toAdd.push("+ bacon");
                    }
                    break;

                case 'chipol':
                    toAdd.push("+ chp mayo");
                    break;

                case "chipot":
                    toAdd.push("+ chp mayo");
                    break;

                case 'mustard': 
                    toAdd.push("+ yel must");
                    break;

                case 'brown mustard':
                    toAdd.push("+ brown must");
                    break;
                
                case 'spicy mustard':
                    toAdd.push("+ brown must");
                    break;

                case 'honey mustard':
                    toAdd.push("+ honey must");
                    break;

                case 'port': 
                    if (order.subNumber == 64 || order.subNumber == 65 || order.subNumber == 66) {
                        toAdd.push("x port");
                    } else {
                        toAdd.push("+ port")
                    }
                    break;

                default:
                    console.error("error could not add topping")

            }
        }
        return (
            <React.Fragment>
                {toAdd.map(elem => {
                    return <li className='topping-text'>{elem}</li>
                })}
            </React.Fragment>
        )
    }

    const formatColdSubs = (order) => {
        let plus;
        let minus;

        // subtractions 
        // checking for blt irregularity 1st
        if (order.subNumber == 1) {
            let natural = ["lettuce", "tomato", "mayo"];
            for (let i = 0; i < order.subtractions.length; i++) {
                if (order.subtractions[i] === "lettuce") {
                    natural.splice(i, 1)
                } else if (order.subtractions[i] === "tomato") {
                    natural.splice(i, 1)
                } else if (order.subtractions[i] === "mayo") {
                    natural.splice(i, 1)
                }
            }
            minus = (
                <React.Fragment>
                    <li className='mw-text'>just:</li>
                    {natural.map(elem => {
                        if (elem === "mayo") elem = "+" + elem;
                        return (<li className='topping-text'>{elem}</li>);
                    })}
                </React.Fragment>
            );
        } else {
            let mikesW = [...subLegend.mikesWay];
            let removed = [];
            for (let i = 0; i < order.subtractions.length; i++) {
                let subtractedItem = order.subtractions[i];
                for (let j = 0; j < mikesW.length; j++) {
                    if (subtractedItem === mikesW[j]) {
                        removed.push(mikesW[j]);
                        mikesW.splice(j, 1);
                        break;
                    }
                }
            }

            // keeping in style with online orders
            if (removed.length > 3) {
                minus = (
                    <React.Fragment>
                        <li className='mw-text'>just:</li>
                        {mikesW.map(elem => {
                            return (<li className='topping-text'>{elem}</li>);
                        })}
                    </React.Fragment>
                );
            } else {
                minus = (
                    <React.Fragment>
                        <li className='mw-text'>Mike's Way</li>
                        {removed.map(elem => {
                            return <li className='topping-text'>-{elem}</li>
                        })}
                    </React.Fragment>
                );
            }

        // ["mayo", "pickle", "banana pepper", "jalapeno pepper", "cherry pepper relish", "brown mustard", "yellow mustard", "spicy mustard", "honey mustard", "mustard"]
        // ["pickles", "ban peps", "jal peps", "mayo", "cpr", "yel must", "brown must", "honey must"];

            // additions time O.O
            plus = subAdditionsHelper(order);
        }

        const subSection = (
            <div className='ticket-sub'>
                <p className='ticket-sub-bread'><span className='ticket-sub-size'>{order.subSize}</span>{order.breadType} #{order.subNumber}</p>
                <ul className='ticket-toppings-container'>
                    {minus}
                    {plus}
                </ul>
                <p className='ticket-sub-notes'>{order.notes}</p>
            </div>
        );

        return subSection;
    }

    const formatHotSubs = (order, subLegend) => {
        let minus = (
            <React.Fragment>
                {order.subtractions.map(elem => {
                    return <li className='topping-text'>{elem}</li>
                })}
            </React.Fragment>
        )

        let plus = subAdditionsHelper(order);

        const subSection = (
            <div className='ticket-sub'>
                <p className='ticket-sub-bread'><span className='ticket-sub-size'>{order.subSize}</span>{order.breadType} #{order.subNumber}</p>
                <ul className='ticket-toppings-container'>
                    {minus}
                    {plus}
                </ul>
                <p className='ticket-sub-notes'>{order.notes}</p>
            </div>
        );

        return subSection;
        
    }

    const formatSideItems = (order) => {
        return (
            <div className='ticket-sub'>
                <h4 className='sides-header'>SIDES</h4>
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
            
            const wholeTicket = (
                <div className='ticket-outer'>
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

        const coldSubPage = (
            <div className='colds-printed-container'>
                <h2 className='colds-page-header'>Cold Subs</h2>
                <div className='colds-grid'>
                    {ordersWithColdOnly}
                </div>
            </div>
        )
        const hotSubPage = (
            <div className='colds-printed-container'>
                <h2 className='colds-page-header'>Hot Subs</h2>
                <div className='colds-grid'>
                    {ordersWithHotOnly}
                </div>
            </div>
        )
        const bothSubPage = (
            <div className='colds-printed-container'>
                <h2 className='colds-page-header'>Cold + Hot Orders</h2>
                <div className='colds-grid'>
                    {ordersWithBoth}
                </div>
            </div>
        )
        const allPages = (
            <div className='all-pages-outer'>
                {coldSubPage}
                {hotSubPage}
                {bothSubPage}
            </div>
        )

        return allPages;

    }
    let main = formatSubOrders(orders);

  return (
    <div>
        {main}
    </div>
  )
}

export default FormattedSubs