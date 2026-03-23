import React, { Component } from 'react'
import api from '../api'
import { AdminNavBar } from '../components'
import styled from 'styled-components'

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px 30px 30px;
`

const Title = styled.h1.attrs({
    className: 'h1',
})`
    margin-bottom: 20px;
`

const Section = styled.div`
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    margin-bottom: 24px;
    padding: 20px;
`

const SectionTitle = styled.h3`
    margin-bottom: 16px;
`

const Row = styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-bottom: 16px;
`

const Field = styled.div`
    flex: 1;
    min-width: 260px;
`

const Label = styled.label`
    margin: 5px 0;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px 0;
`

const ErrorText = styled.p`
    color: #c62828;
    font-size: 0.9rem;
    margin: 4px 0 0 0;
`

const Button = styled.button.attrs({
    className: 'btn btn-primary',
})`
    margin: 5px 0;
`

const DeleteButton = styled.button.attrs({
    className: 'btn btn-danger btn-sm',
    type: 'button',
})``

const Empty = styled.p`
    color: #666;
    margin: 0;
`

const List = styled.div`
    display: grid;
    gap: 10px;
`

const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ececec;
    border-radius: 6px;
    padding: 12px 14px;
`

const ToggleCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border: 1px solid #ececec;
    border-radius: 6px;
    padding: 16px;
`

const StatusText = styled.p`
    color: #444;
    margin: 4px 0 0 0;
`

class ClassConfig extends Component {
    constructor(props) {
        super(props)

        this.state = {
            roomNo: '',
            time: '',
            roomNos: [],
            times: [],
            isLoading: false,
            roomNoError: '',
            timeError: '',
            allowReservations: true,
            isSavingReservationSetting: false,
        }
    }

    validateRoomNo = (value) => {
        const trimmedValue = value.trim()

        if (!trimmedValue) {
            return 'Please enter a class number.'
        }

        if (!/^[A-Za-z0-9][A-Za-z0-9 /-]{0,29}$/.test(trimmedValue)) {
            return 'Use 1-30 letters or numbers. Spaces, "/" and "-" are allowed.'
        }

        return ''
    }

    validateTime = (value) => {
        const trimmedValue = value.trim()

        if (!trimmedValue) {
            return 'Please enter a time range.'
        }

        const match = trimmedValue.match(/^([01]\d|2[0-3]):([0-5]\d)\s-\s([01]\d|2[0-3]):([0-5]\d)$/)

        if (!match) {
            return 'Use the format HH:MM - HH:MM, for example 09:00 - 10:00.'
        }

        const startMinutes = Number(match[1]) * 60 + Number(match[2])
        const endMinutes = Number(match[3]) * 60 + Number(match[4])

        if (endMinutes <= startMinutes) {
            return 'The end time must be later than the start time.'
        }

        return ''
    }

    async componentDidMount() {
        await this.loadConfig()
    }

    loadConfig = async () => {
        this.setState({ isLoading: true })

        try {
            const [roomRes, timeRes, settingsRes] = await Promise.allSettled([
                api.getRoomNumbers(),
                api.getTimes(),
                api.getAppSettings(),
            ])

            this.setState({
                roomNos: roomRes.status === 'fulfilled' ? roomRes.value.data.data : [],
                times: timeRes.status === 'fulfilled' ? timeRes.value.data.data : [],
                allowReservations: settingsRes.status === 'fulfilled'
                    ? settingsRes.value.data.data.allowReservations
                    : true,
                isLoading: false,
            })
        } catch (error) {
            this.setState({
                roomNos: [],
                times: [],
                allowReservations: true,
                isLoading: false,
            })
        }
    }

    handleChangeRoomNo = (event) => {
        const roomNo = event.target.value
        this.setState({
            roomNo,
            roomNoError: this.validateRoomNo(roomNo),
        })
    }

    handleChangeTime = (event) => {
        const time = event.target.value
        this.setState({
            time,
            timeError: this.validateTime(time),
        })
    }

    handleCreateRoomNo = async () => {
        const { roomNo } = this.state
        const roomNoError = this.validateRoomNo(roomNo)

        if (roomNoError) {
            this.setState({ roomNoError })
            return
        }

        try {
            await api.createRoomNumber({ roomNo: roomNo.trim() })
            this.setState({ roomNo: '', roomNoError: '' })
            await this.loadConfig()
        } catch (error) {
            window.alert('Failed to save class number.')
        }
    }

    handleCreateTime = async () => {
        const { time } = this.state
        const timeError = this.validateTime(time)

        if (timeError) {
            this.setState({ timeError })
            return
        }

        try {
            await api.createTime({ time: time.trim() })
            this.setState({ time: '', timeError: '' })
            await this.loadConfig()
        } catch (error) {
            window.alert('Failed to save time.')
        }
    }

    handleDeleteRoomNo = async (id) => {
        if (!window.confirm('Delete this class number?')) {
            return
        }

        try {
            await api.deleteRoomNumber(id)
            await this.loadConfig()
        } catch (error) {
            window.alert('Failed to delete class number.')
        }
    }

    handleDeleteTime = async (id) => {
        if (!window.confirm('Delete this time option?')) {
            return
        }

        try {
            await api.deleteTime(id)
            await this.loadConfig()
        } catch (error) {
            window.alert('Failed to delete time option.')
        }
    }

    handleToggleReservations = async () => {
        const { allowReservations } = this.state

        this.setState({ isSavingReservationSetting: true })

        try {
            const response = await api.updateReservationAvailability({
                allowReservations: !allowReservations,
            })

            this.setState({
                allowReservations: response.data.data.allowReservations,
                isSavingReservationSetting: false,
            })
        } catch (error) {
            this.setState({ isSavingReservationSetting: false })
            window.alert('Failed to update reservation availability.')
        }
    }

    render() {
        const {
            roomNo,
            time,
            roomNos,
            times,
            isLoading,
            roomNoError,
            timeError,
            allowReservations,
            isSavingReservationSetting,
        } = this.state

        return (
            <Wrapper>
                <AdminNavBar />
                <Title>Admin Config</Title>

                <Section>
                    <SectionTitle>Reservation Access</SectionTitle>
                    <ToggleCard>
                        <div>
                            <Label>Reservation Page</Label>
                            <StatusText>
                                {allowReservations
                                    ? 'Users can currently create reservations.'
                                    : 'Users are currently blocked from creating reservations.'}
                            </StatusText>
                        </div>
                        <Button
                            type="button"
                            onClick={this.handleToggleReservations}
                            disabled={isSavingReservationSetting}
                        >
                            {allowReservations ? 'Disable Reservations' : 'Enable Reservations'}
                        </Button>
                    </ToggleCard>
                </Section>

                <Section>
                    <SectionTitle>Class Numbers</SectionTitle>
                    <Row>
                        <Field>
                            <Label>Class Number</Label>
                            <InputText
                                type="text"
                                value={roomNo}
                                onChange={this.handleChangeRoomNo}
                                placeholder="Example: Room 1"
                            />
                            {roomNoError && <ErrorText>{roomNoError}</ErrorText>}
                        </Field>
                        <Button type="button" onClick={this.handleCreateRoomNo} disabled={Boolean(roomNoError) || !roomNo.trim()}>
                            Save Class Number
                        </Button>
                    </Row>

                    <List>
                        {roomNos.length === 0 && !isLoading && (
                            <Empty>No class numbers configured yet.</Empty>
                        )}
                        {roomNos.map((room) => (
                            <ListItem key={room._id}>
                                <span>{room.roomNo}</span>
                                <DeleteButton onClick={() => this.handleDeleteRoomNo(room._id)}>
                                    Delete
                                </DeleteButton>
                            </ListItem>
                        ))}
                    </List>
                </Section>

                <Section>
                    <SectionTitle>Time Options</SectionTitle>
                    <Row>
                        <Field>
                            <Label>Select Time</Label>
                            <InputText
                                type="text"
                                value={time}
                                onChange={this.handleChangeTime}
                                placeholder="Example: 09:00 - 10:00"
                            />
                            {timeError && <ErrorText>{timeError}</ErrorText>}
                        </Field>
                        <Button type="button" onClick={this.handleCreateTime} disabled={Boolean(timeError) || !time.trim()}>
                            Save Time
                        </Button>
                    </Row>

                    <List>
                        {times.length === 0 && !isLoading && (
                            <Empty>No time options configured yet.</Empty>
                        )}
                        {times.map((timeOption) => (
                            <ListItem key={timeOption._id}>
                                <span>{timeOption.time}</span>
                                <DeleteButton onClick={() => this.handleDeleteTime(timeOption._id)}>
                                    Delete
                                </DeleteButton>
                            </ListItem>
                        ))}
                    </List>
                </Section>
            </Wrapper>
        )
    }
}

export default ClassConfig
