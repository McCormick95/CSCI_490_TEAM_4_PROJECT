import React from 'react';
import PropTypes from 'prop-types';

export function Card({ className = "", children }) {
    return (
        <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
            {children}
        </div>
    );
}

Card.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

export function CardHeader({ className = "", children }) {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
            {children}
        </div>
    );
}

CardHeader.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

export function CardTitle({ className = "", children }) {
    return (
        <h3 className={`text-lg font-semibold ${className}`}>
            {children}
        </h3>
    );
}

CardTitle.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

export function CardContent({ className = "", children }) {
    return (
        <div className={`p-6 pt-0 ${className}`}>
            {children}
        </div>
    );
}

CardContent.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};