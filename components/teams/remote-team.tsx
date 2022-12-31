import { FC, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import {
    Alert,
    Button,
    ColorSwatch,
    Container,
    Group,
    LoadingOverlay, Modal,
    SegmentedControl,
    Text,
    Radio,
    useMantineTheme,
} from '@mantine/core';

import { DateRangePicker } from '@mantine/dates';

import RedCircleIcon from '../layout/icon/red-circle-icon';
import WorkCalendar from '../layout/work-calendar';
import { useMediaQuery } from '@mantine/hooks';
import { RadioGroup } from '@mantine/core';

const RemoteTeam: FC<{
    fetchUrl: string;
    groups: { label: string; value: string }[];
}> = (props) => {
    const [remoteDays, setRemoteDays] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedGroup, setSelectedGroup] = useState<string>('0');
    const [showError, setShowError] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [exportRange, setExportRange] = useState<[Date, Date]>([new Date(), moment(new Date()).add(6, "month").toDate()]);
    const theme = useMantineTheme();
    const largeScreen = useMediaQuery('(min-width: 600px)');

    const requestRemoteDaysFromServer = useCallback(
        async (startDate: Date, group: string) => {
            if (startDate && +group > 0) {
                setShowLoading(true);
                setShowError(false);
                const response = await fetch(
                    props.fetchUrl +
                    '?' +
                    new URLSearchParams({
                        date: moment(startDate).format('YYYY-MM-DD'),
                        group: group,
                    }),
                );

                if (response && response.ok) {
                    const data: { monthRemoteDays: string[] } = await response.json();
                    setRemoteDays(data.monthRemoteDays.map((rm) => new Date(rm)));
                } else {
                    setShowError(true);
                }
                setShowLoading(false);
            }
        },
        [props.fetchUrl],
    );

    useEffect(() => {
        requestRemoteDaysFromServer(selectedDate, selectedGroup);
    }, [selectedDate, selectedGroup, requestRemoteDaysFromServer]);

    useEffect( () => {
        setExportRange([selectedDate,moment(selectedDate).add(6, "month").toDate()])
    }, [selectedDate])

    const changeMonthHandler = async (month: Date) => {
        setSelectedDate(month);
    };

    const changeGroupHandler = (group: string) => {
        setSelectedGroup(group);
    };

    const errorAlertHandler = () => {
        setShowError(false);
    };

    const onExport = async () => {
        const startDate = new Date();
        await fetch(
            '/api/export' +
            '?' +
            new URLSearchParams({
                startDate: '2023-01-01',
                endDate: '2023-02-01',
                group: '5',
                team: 'dos',
            }),
        )
            .then((rep) => rep.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob], { type: 'text/calendar;charset=utf-8' }));
                let a = document.createElement('a');
                a.href = url;
                a.download = 'remote_days.ics';
                a.click();
            });
    };

    return (
        <div style={{ position: 'relative' }}>
            <Container>
                <Group direction='column' grow>
                    <LoadingOverlay visible={showLoading} />
                    {showError && (
                        <Alert
                            icon={<RedCircleIcon />}
                            title='Communication Error'
                            color='red'
                            withCloseButton
                            onClose={errorAlertHandler}
                        >
                            Communication with the server has failed. Please try again later.
                        </Alert>
                    )}
                    <SegmentedControl
                        fullWidth
                        value={selectedGroup}
                        onChange={changeGroupHandler}
                        data={props.groups}
                        size={largeScreen ? 'sm' : 'xs'}
                    />
                    <WorkCalendar onMonthChange={changeMonthHandler} highlightedDays={remoteDays} />
                    {selectedGroup !== '0' && (
                        <Group align='center' position='center'>
                            <ColorSwatch
                                color={theme.colors.cyan[9]}
                                size={largeScreen ? 30 : 20}
                            />
                            <Text color='dimmed' size={largeScreen ? 'sm' : 'xs'}>
                                Remote Days
                            </Text>
                        </Group>
                    )}
                    <Modal
                        opened={exportOpen}
                        onClose={() => setExportOpen(false)}
                        title="Introduce yourself!"
                    >
                        <DateRangePicker
                            label="Calendar Range"
                            placeholder="Pick calendar range"
                            value={exportRange}
                            onChange={setExportRange}
                        />
                    </Modal>

                    <Button onClick={() => setExportOpen(true)} disabled={selectedGroup === '0'} >Download Month</Button>
                </Group>
            </Container>
        </div>
    );
};

export default RemoteTeam;
