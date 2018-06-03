<template>

    <div class="game-rooms">
        
        <button type="button" class="btn btn-outline-danger exit-butt" @click="setPlayer(null)">Выйти</button>
        
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Список комнат</h5>
                <button type="submit" class="btn btn-primary mb-2" @click="addGameRoom">Добавить</button>
            </div>

            <template v-if="isLoad">
                <div v-if="rooms === 'none'" class="alert alert-light" role="alert">
                    Комнат пока нет :(
                </div>
                <ul v-else class="list-group list-group-flush">
                    <li v-for="(room, key) in rooms" :key="key" class="list-group-item">
                        <p class="card-text">Комната №{{ room.id }}. Игроки: {{ room.colPlayers }}/2
                            <span>({{ room.players | playersList }})</span>
                            <button type="button" class="btn btn-outline-primary" :disabled="room.colPlayers === 2" @click="connectGameRoom(key)">Присоединиться</button>
                        </p>
                    </li>
                </ul>
            </template>

            <div v-else class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
    name: 'TheGameRooms',

    filters: {
        playersList: value => {
            if (!value) return '';
            let result = [];
            for(const key of Object.keys(value)) {
                result.push(value[key].name);
            }
            return result.join(', ');

            /*return value.map(item => {
                return item.name;
            }).join(', ');*/
        },
    },

    data() {
        return {
            isLoad: false,
        };
    },

    computed: {
        ...mapGetters({
            rooms: 'getRooms',
        }),
    },

    methods: {
        ...mapMutations(['setPlayer']),
        ...mapActions(['addGameRoom', 'connectGameRoom', 'loadRoomsFromApi']),
    },

    created() {
        this.loadRoomsFromApi().then(() => {
            this.isLoad = true;
        });
    },
};
</script>

<style lang="scss" scoped>
.game-rooms {
    width: 40%;
    margin: 50px auto;

    .card {
        margin-bottom: 30px;

        .progress {
            margin: 10px 0;
        }

        .card-title {
            display: inline-block;
        }

        .btn {
            float: right;
        }
    }

    .exit-butt {
        margin: 0 0 30px calc(100% - 80px);
    }
}
</style>

