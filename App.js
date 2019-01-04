import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Makiko } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Slugfy from 'slugify';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


type Props = {};
export default class App extends Component<Props> {
    state = {
        fname: '',
        sname: '',
        calculate: 0,
        result: '',
        loading: false,
        complete: false,
        error: null,
    }
    componentWillMount() {
        //this.getData();
    }

    getData() {
        
        const url = `https://lovemeter-mobileapp.herokuapp.com/?fname=${Slugfy(this.state.fname, { replacement: ' ', remove: null, lower: true })}&sname=${Slugfy(this.state.sname, { replacement: ' ', remove: null, lower: true })}`;
        
        this.setState({ loading: true });
        fetch(url)
        .then(res => res.json())
        .then(res => {
            this.setState({
                error: res.error || null,
                loading: false,
                complete: true,
                result: res.body.result,
                calculate: parseInt(res.body.percentage)
            });
        })
        .catch(error => {
            this.setState({ error })
        });

    }

    getDataLoading() {
        if (!this.state.loading) return null;

        return (
            <View style={{ top: width / 2 }}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    }

    getDataComplete() {
        const barWidth = Dimensions.get('screen').width - 30;
        const progressCustomStyles = {
            backgroundColor: '#7D7D7D', 
            borderRadius: 10,
            borderColor: '#D4d4d4',
        };
        if (!this.state.complete) return null;

        return(
            <View style={{ top: width / 2, alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>{this.state.result}</Text>
                <ProgressBarAnimated
                {...progressCustomStyles}
                width={barWidth}
                height={20}
                barEasing='bounce'
                barAnimationDuration={2500}
                maxValue={100}
                value={this.state.calculate}
                />
                <Text style={{ fontSize: 20 }}>Score of your love {this.state.calculate}</Text>
            </View>
        )
    }

    deleteButton() {
        if (!this.state.complete) return null;

        return (
            <Button
            icon={{ name: 'trash', type: 'font-awesome' }}
            large
            onPress={() => {
                if (!this.state.loading) {
                    this.setState({
                        fname: '',
                        sname: '',
                        calculate: 0,
                        result: '',
                        loading: false,
                        complete: false,
                        error: null
                    });
                }
            }}
            />
        );
    }

    render() {
        return (
        <View style={styles.container}>
            
            <Image
            style={{ zIndex: -1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, width: width, height: height }}
            source={{uri:'https://picsum.photos/500/800'}} />
            <View style={{ marginTop: 50, alignItems: 'center' }}>
                <Makiko
                style={styles.textInputStyle}
                onSubmitEditing={() => this.refs.sname.focus()}
                value={this.state.fname}
                onChangeText={(fname) => this.setState({ fname })}
                label={'Your Name'}
                iconClass={FontAwesomeIcon}
                iconName={'heart'}
                iconColor={'white'}
                inputStyle={{ color: '#db786d' }} />
                <Makiko
                style={styles.textInputStyle}
                ref='sname'
                value={this.state.sname}
                onChangeText={(sname) => this.setState({ sname })}
                onSubmitEditing={() => {
                    if (this.state.fname === '' || this.state.sname === '') {
                        alert('Please make sure you enter the names exactly.')
                    } else {
                        if (!this.state.loading && !this.state.complete) {
                            this.getData()
                        }
                    }
                }}
                label={"Your lover's name"}
                iconClass={FontAwesomeIcon}
                iconName={'heart'}
                iconColor={'white'}
                inputStyle={{ color: '#db786d' }} />
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Button
                    icon={{ name: 'heart', type: 'font-awesome' }}
                    large
                    onPress={() => {
                        if (this.state.fname === '' || this.state.sname === '') {
                            alert('Please make sure you enter the names exactly.')
                        } else {
                            if (!this.state.loading && !this.state.complete) {
                                this.getData()
                            }
                        }
                    }}
                    title='Calculate Your Love' />
                    {this.deleteButton()}
                </View>
            </View>
            {this.getDataLoading()}
            {this.getDataComplete()}
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    textInputStyle: {
        marginTop: 10,
        width: width - 32,
        alignSelf: 'center',
    },
});
