import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        user: {},
        sysData:{},
		lang:'',
		PLplay: false,
		baseURL:'http://soulmatemeet.vip:8080',
		imgHead:'http://soulmatemeet.vip:8888/',
		testBaseURL:'http://soulmatemeet.vip:3030',
		testImgHead:'http://soulmatemeet.vip:3333/'
    }),
    actions: {
        increment() {
            this.count++;
        },
        decrement() {
            this.count--;
        },
        reset() {
            this.count = 0;
        },
    },
});

export default useCounterStore