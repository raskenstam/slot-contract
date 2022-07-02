use crate::msg::{self, GetWinTableResp, HandleMsg, InitMsg, QueryMsg};
use crate::state::{config, config_read, State};
use cosmwasm_std::{
    to_binary, Api, BankMsg, Binary, Coin, CosmosMsg, Env, Extern, HandleResponse, HumanAddr,
    InitResponse, Querier, StdError, StdResult, Storage, Uint128,
};
use rand::{RngCore, SeedableRng};
use rand_chacha::ChaChaRng;
use sha2::{Digest, Sha256};
static BUYIN: i32 = 250;
static WIN_TABLE: [i32; 11] = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500];
pub fn init<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    _msg: InitMsg,
) -> StdResult<InitResponse> {
    let state = State {
        owner: deps.api.canonical_address(&env.message.sender)?,
        total_started: 0,
        entropy: _msg.entropy,
    };
    config(&mut deps.storage).save(&state)?;
    Ok(InitResponse::default())
}

pub fn handle<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: HandleMsg,
) -> StdResult<HandleResponse> {
    match msg {
        HandleMsg::StartSlot { entropy } => start_slot(deps, env, entropy),
        HandleMsg::Terminate {} => terminate(deps, env),
    }
}

pub fn query<S: Storage, A: Api, Q: Querier>(
    deps: &Extern<S, A, Q>,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetWinTable {} => to_binary(&query_wintable(deps)?),
    }
}
pub fn terminate<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    _env: Env,
) -> StdResult<HandleResponse> {
    let sender_address_raw = deps.api.canonical_address(&_env.message.sender)?;
    let state = config_read(&deps.storage).load()?;
    if sender_address_raw != state.owner {
        return Err(StdError::Unauthorized { backtrace: None });
    }
    let started = state.total_started * BUYIN;
    return Ok(payout(
        _env.contract.address,
        _env.message.sender,
        Uint128(started as u128),
    ));
}

pub fn start_slot<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    _env: Env,
    entropy: i32,
) -> StdResult<HandleResponse> {
    let funds = _env.message.sent_funds[0].clone();
    if funds.denom != "uscrt" || funds.amount < Uint128(BUYIN as u128) {
        return Err(StdError::generic_err(
            "insufficient_funds  uscrt required 250",
        ));
    }
    let state = config_read(&deps.storage).load()?;
    let time = _env.block.time;
    let mut combined_secret: Vec<u8> = time.to_be_bytes().to_vec();
    combined_secret.extend(entropy.to_be_bytes());
    let random_seed: [u8; 32] = Sha256::digest(&combined_secret).into();
    let mut rng = ChaChaRng::from_seed(random_seed);
    let pay = (rng.next_u32() % WIN_TABLE.len() as u32) as usize;
    config(&mut deps.storage).update(|mut state| {
        state.total_started += 1;
        Ok(state)
    })?;
    if WIN_TABLE[pay] == 0 {
        return Ok(HandleResponse {
            messages: vec![],
            log: vec![],
            data: None,
        });
    }
    return Ok(payout(
        _env.contract.address,
        _env.message.sender,
        Uint128(WIN_TABLE[pay] as u128),
    ));
}

fn query_wintable<S: Storage, A: Api, Q: Querier>(
    _deps: &Extern<S, A, Q>,
) -> StdResult<GetWinTableResp> {
    Ok(GetWinTableResp {
        win_table: WIN_TABLE,
    })
}
pub fn payout(contract_address: HumanAddr, player: HumanAddr, amount: Uint128) -> HandleResponse {
    HandleResponse {
        messages: vec![CosmosMsg::Bank(BankMsg::Send {
            from_address: contract_address,
            to_address: player,
            amount: vec![Coin {
                denom: "uscrt".to_string(),
                amount,
            }],
        })],
        log: vec![],
        data: None,
    }
}
