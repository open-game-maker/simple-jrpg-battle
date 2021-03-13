({
    //JRPGの戦闘のようなサンプルゲーム
    /**
     * ゲームの初期化処理
     * @param {*} ogm 汎用関数
     * @param {*} random 乱数生成
     * @param {*} rule ルール
     */
    initialize: function(ogm, random, rule) {
        //ゲームの状態
        var state;

        //プレイヤー1の能力
        var playerHP1 = 100;
        var attack1 = 20;

        //プレイヤー2の能力
        var playerHP2 = 200;
        var attack2 = 50;

        state = [[playerHP1, attack1], [playerHP2, attack2]];

        //選択の情報をプレイヤーに送信
        var selections = ogm.newArray(2);
        selections[0].push(ogm.createPlayerSelect(0, 0, null));
        selections[1].push(ogm.createPlayerSelect(0, 0, null));

        //すべてのゲーム状態をプレイヤーに共有する（完全情報ゲームとなる）
        var shares = ogm.newArray(2);
        shares[0].push([]);
        shares[1].push([]);

        //ゲームの情報をプレイヤーに送信する
        var signal = ogm.newArray(2);
        for (var index = 0; index < ogm.numberOfPlayer; index++) {
            //プレイヤーIDを送る（シグナルIDの-1番目をプレイヤーIDを送る用とする）
            signal[index].push([ogm.PLAYER_ID_SIGNAL_ID, index]);
            //プレイヤー数を送る（シグナルIDの-2番目をプレイヤー数を送る用とする）
            signal[index].push([ogm.PLSYER_NUMBER_SIGNAL_ID, ogm.numberOfPlayer]);
        }

        return ogm.createGameNextResult(
            state,
            selections,
            shares,
            null,
            signal,
            null
        );
    },
    /**
     * ゲームの次状態の生成
     * @param {*} ogm 汎用関数
     * @param {*} random 乱数生成
     * @param {*} state ゲームの状態
     * @param {*} selectList プレイヤーの選択
     */
    next: function(ogm, random, state, selectList) {
        var playerHP1 = state[0][0];
        var attack1 = state[0][1];

        var playerHP2 = state[1][0];
        var attack2 = state[1][1];

        var losePlayer = [];

        //プレイヤー1の選択を処理
        for (var selectIndex = 0; selectIndex < selectList[0].length; selectIndex++) {
            var player1Select = selectList[0][selectIndex].playersSelection;
            if (player1Select[0] == 1) {
                //プレイヤー1の選択が攻撃だった場合、プレイヤー2のHPからプレイヤー1の攻撃力を引く
                playerHP2 -= attack1;
                if (playerHP2 <= 0) {
                    //プレイヤー2が攻撃でHPが0以下になった場合、敗北プレイヤーの配列にプレイヤー2をセットする
                    losePlayer.push(2);
                }
            }
        }

        //プレイヤー2の選択を処理
        for (var selectIndex = 0; selectIndex < selectList[1].length; selectIndex++) {
            var player2Select = selectList[1][selectIndex].playersSelection;
            if (player2Select[0] == 1) {
                playerHP1 -= attack2;
                if (playerHP1 <= 0) {
                    losePlayer.push(1);
                }
            }
        }

        //次のゲーム状態を生成
        var nextState = [[playerHP1, attack1], [playerHP2, attack2]];

        //ゲームの勝者を表す変数（nullの場合はゲームは続く）
        var winnerSet = null;
        if (losePlayer.length > 0) {
            //敗北プレイヤーの配列に要素が追加されている場合、ゲーム終了。勝利プレイヤーに1、敗北プレイヤーに0をセットする
            winnerSet = [1, 1];
            for (var i = 0; i < losePlayer.length; i++) {
                winnerSet[losePlayer[i] - 1] = 0;
            }
        }

        //選択の情報をプレイヤーに送信
        var selections = ogm.newArray(2);
        selections[0].push(ogm.createPlayerSelect(0, 0, null));
        selections[1].push(ogm.createPlayerSelect(0, 0, null));

        //すべてのゲーム状態をプレイヤーに共有する（完全情報ゲームとなる）
        var shares = ogm.newArray(2);
        shares[0].push([]);
        shares[1].push([]);

        return ogm.createGameNextResult(
            nextState,
            selections,
            shares,
            null,
            null,
            winnerSet
        );
    },
    /**
     * 選択肢の制御
     */
    selectionConstraintsList: [{
        /**
         * プレイヤーが選択できるすべての選択肢の生成
         * @param {*} ogm 汎用関数
         * @param {*} shareState プレイヤーに渡されているゲームの状態の情報
         * @param {*} selectionSignal 選択に紐づけられている情報
         */
        createAll: function(
            ogm,
            shareState,
            selectionSignal
        ) {
            var selections = [];
            //何もしない
            selections.push([
                [0], null
            ]);
            //攻撃
            selections.push([
                [1], null
            ]);
            return selections;
        }
    }]
})
