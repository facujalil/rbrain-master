import React from 'react';
import "../css/LoadingMentalMap.css";

export default function LoadingMentalMap() {

    const mentalMap = {
        'info': 'Lorem ipsum', 'children': [
            {
                'info': 'Lorem', 'children': [
                    { 'info': 'Lorem', 'children': [{ 'info': 'Lorem', 'children': [] }] },
                    { 'info': 'Lorem', 'children': [{ 'info': 'Lorem', 'children': [] }] }]
            }, {
                'info': 'Lorem', 'children': [
                    { 'info': 'Lorem', 'children': [{ 'info': 'Lorem', 'children': [] }] }, { 'info': 'Lorem', 'children': [{ 'info': 'Lorem', 'children': [] }] }]
            }]
    }

    function renderMentalMap(node, depth = 0) {
        return (
            <div id="mental-map-loading" className="container-mental-map">
                <div
                    className="mental-map"
                    style={{ "--depth": depth }}
                >
                    <div className="mental-map-name"><p>{node.info}</p></div>
                    {node.children && (
                        <div className="mental-map-children">
                            {node.children.map((child, index) => (
                                <div
                                    className="mental-map-children_children"
                                    key={index}
                                >
                                    {renderMentalMap(child, depth + 1)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            {renderMentalMap(mentalMap)}
        </div>
    )
}
