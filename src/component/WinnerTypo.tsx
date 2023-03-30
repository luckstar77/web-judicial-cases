import React from 'react';

interface Props {
    win: 'plaintiff' | 'defendant' | string;
    plaintiff: string;
    defendant: string;
}

function MyComponent(props: Props) {
    const { win, plaintiff, defendant } = props;

    let displayText = '無';

    if (win === 'plaintiff') {
        displayText = plaintiff;
    } else if (win === 'defendant') {
        displayText = defendant;
    }

    return <>{displayText}</>;
}

export default MyComponent;
