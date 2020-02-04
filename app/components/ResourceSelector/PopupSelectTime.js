import React, { Component } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
const hour = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];
const minute = [
    0, 15, 30, 45
];

const localization = [
    'AM', 'PM'
];

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

export default class PopupSelectTime extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hour: 2,
            minute: 0,
            localization: 'PM'
        }
    }

    selectHour(hour) {
        this.setState({
            hour
        })
    }
    selectMinute(minute) {
        this.setState({ minute })
    } 
    selectLocal(localization) {
        this.setState({
            localization
        })
    }

    renderHour() {
        return hour.map((obj, index) => {
            return (
                <div
                    onClick={() => this.selectHour(obj)}
                    style={styles.localziation}
                    key={index}>
                    <div style={{
                        backgroundColor: this.state.hour === obj ? '#FFFEC4' : '#ffffff',
                        padding: 7,
                        width: 30,
                        borderRadius: 20,
                        textAlign: 'center',
                        fontWeight: this.state.hour === obj ? '600' : '500',
                    }}>
                        {leftPad(obj, 2)}
                    </div>
                </div>
            )
        })
    }
    renderMinute() {
        return minute.map((obj, index) => {
            return (
                <div
                    onClick={() => this.selectMinute(obj)}
                    style={styles.localziation}
                    key={index}>
                    <div style={{
                        backgroundColor: this.state.minute === obj ? '#FFFEC4' : '#ffffff',
                        padding: 7,
                        width: 30,
                        borderRadius: 20,
                        textAlign: 'center',
                        fontWeight: this.state.minute === obj ? '600' : '500',
                    }}>
                        {leftPad(obj, 2)}
                    </div>
                </div>

            )
        })
    }

    closePopup() {
        const { closePopupSelectTime, isStart, isEnd } = this.props;
        const { hour, minute, localization } = this.state;
        let time;
        if (isStart) {
            time = {
                data: `${leftPad(hour, 2).toString()}:${leftPad(minute, 2).toString()} ${localization}`,
                isStart: true
            }
        }
        if (isEnd) {
            time = {
                data: `${leftPad(hour, 2).toString()}:${leftPad(minute, 2).toString()} ${localization}`,
                isEnd: true
            }
        }
        closePopupSelectTime(time);
    }

    renderLocalization() {
        return localization.map((obj, index) => {
            return (
                <div
                    onClick={() => this.selectLocal(obj)}
                    style={styles.localziation}
                    key={index}>
                    <div style={{
                        backgroundColor: this.state.localization === obj ? '#FFFEC4' : '#ffffff',
                        padding: 6,
                        width: 40,
                        borderRadius: 30,
                        textAlign: 'center',
                        fontWeight: this.state.localization === obj ? '600' : '500',
                    }}>
                        {leftPad(obj, 2)}
                    </div>
                </div>

            )
        })
    }

    render() {
        const { closePopupSelectTime } = this.props;
        return (
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <div style={styles.item}>
                        <div style={styles.titleHour}>
                            Hour
                        </div>
                        <div style={styles.hour}>
                            {this.renderHour()}
                        </div>
                    </div>
                    <div style={styles.item}>
                        <div style={styles.title}>
                            Minute
                        </div>
                        <div style={styles.minute}>
                            {this.renderMinute()}
                        </div>
                    </div>
                    <div style={styles.item}>
                        <div style={styles.titleLocal}>
                            Localziation
                        </div>
                        <div style={styles.minute}>
                            {this.renderLocalization()}
                        </div>
                    </div>
                </div>
                <div style={styles.containerButton}>
                    <div
                        onClick={() => this.closePopup()}
                        style={styles.button}>
                        Select
                    </div>
                </div>
            </div>

        )
    }
}

const styles = {
    container: {
        top: 0,
        right: 0,
        left: 0,
        bottom:-40,
        position: 'absolute',
        boxShadow: '0 0 7px rgba(0, 0, 0, 0.13)',
        backgroundColor: '#ffffff',
        zIndex: 999,
        borderRadius: 20,
    },
    title: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#1B75C0',
        color: '#ffffff',
        fontWeight: '600'
    },
    titleHour: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#1B75C0',
        color: '#ffffff',
        fontWeight: '600',
        borderTopLeftRadius: 10
    },
    titleLocal: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#1B75C0',
        color: '#ffffff',
        fontWeight: '600',
        borderTopRightRadius: 10
    },
    hour: {
        textAlign: 'center',
        padding: 10,
        height: 350,
        overflowY: 'scroll'
    },
    minute: {
        textAlign: 'center',
        padding: 10,
    },
    item: {
        flex: 1,
        fontSize: 15
    },
    containerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: -10,
    },
    button: {
        backgroundColor: '#1B75C0',
        width: 120,
        color: '#ffffff',
        fontWeight: '600',
        padding: 15,
        borderRadius: 3,
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: 16,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    localziation: {
        marginTop: 15,
        cursor: 'pointer',
        padding: 5,
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
}
