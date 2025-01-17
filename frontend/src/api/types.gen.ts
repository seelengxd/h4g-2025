// This file is auto-generated by @hey-api/openapi-ts

export type ApprovalUpdate = {
    task_user_ids: Array<(number)>;
};

export type AuctionCreate = {
    product_id: number;
    reserve_price: number;
};

export type AuctionPublic = {
    id: number;
    product: MiniProductPublic;
    bids: Array<BidPublic>;
    reserve_price: number;
    completed: boolean;
    created_at: string;
};

export type AuditLogPublic = {
    id: number;
    parent_type: string;
    parent_id: number;
    user_id: number;
    log_user: MiniUserPublic;
    action: string;
    created_at: string;
};

export type BidCreate = {
    bid: number;
};

export type BidPublic = {
    id: number;
    points: number;
    user: MiniUserPublic;
    auction_id: number;
};

export type BidTransactionPublic = {
    id: number;
    amount: number;
    parent_id: number;
    parent_type: string;
    created_at: string;
    bid: BidPublic;
};

export type Body_create_file_files_post = {
    file: (Blob | File);
};

export type Body_log_in_auth_login_post = {
    grant_type?: (string | null);
    username: string;
    password: string;
    scope?: string;
    client_id?: (string | null);
    client_secret?: (string | null);
};

export type Category = 'food' | 'nonfood' | 'special';

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type MiniOrderPublic = {
    id: number;
    order_products: Array<OrderProductPublic>;
    state: OrderState;
    user: MiniUserPublic;
};

export type MiniProductPublic = {
    id: number;
    category: Category;
    name: string;
    image?: (string | null);
    points: number;
    total_qty: number;
};

export type MiniUserPublic = {
    id: number;
    role: Role;
    full_name: string;
    username: string;
    image: (string | null);
};

export type OrderCreate = {
    order_products: Array<OrderProductCreate>;
};

export type OrderProductCreate = {
    product_id: number;
    qty: number;
};

export type OrderProductPublic = {
    product: MiniProductPublic;
    points: number;
    qty: number;
};

export type OrderPublic = {
    id: number;
    order_products: Array<OrderProductPublic>;
    state: OrderState;
    user: MiniUserPublic;
    logs: Array<AuditLogPublic>;
};

/**
 * Possible transitions:
 *
 * PENDING --> APPROVED --> CLAIMED
 *
 * PENDING --> REJECTED
 *
 * PENDING --> WITHDRAWN
 */
export type OrderState = 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'claimed';

export type OrderTransactionPublic = {
    id: number;
    amount: number;
    parent_id: number;
    parent_type: string;
    created_at: string;
    order: OrderPublic;
};

export type OrderUpdate = {
    state: OrderState;
};

export type ProductCreate = {
    category: Category;
    name: string;
    image?: (string | null);
    points: number;
    total_qty: number;
};

export type ProductPublic = {
    id: number;
    category: Category;
    name: string;
    image?: (string | null);
    points: number;
    total_qty: number;
    logs: Array<AuditLogPublic>;
    order_products: Array<ProductTransactionPublic>;
};

/**
 * This is scuffed, but its actually order product (but from product pov instead of orders)
 */
export type ProductTransactionPublic = {
    id: number;
    order_id: number;
    user: MiniUserPublic;
    order_state: OrderState;
    points: number;
    qty: number;
    created_at: string;
};

export type RequestState = 'pending' | 'approved' | 'rejected';

export type Role = 'resident' | 'staff' | 'admin';

export type TaskUserPublic = {
    id: number;
    task_id: number;
    user: MiniUserPublic;
    state: RequestState;
    created_at: string;
    updated_at: string;
    justification?: (string | null);
};

export type Token = {
    access_token: string;
    token_type: string;
    user: UserPublic;
};

export type UserCreate = {
    role: Role;
    username: string;
    full_name: string;
    image?: (string | null);
};

export type UserPublic = {
    id: number;
    role: Role;
    full_name: string;
    username: string;
    image: (string | null);
    points: number;
    suspended: boolean;
    transactions: Array<(BidTransactionPublic | OrderTransactionPublic | VoucherTaskTransactionPublic)>;
};

export type UserUpdate = {
    role: Role;
    username: string;
    full_name: string;
    image?: (string | null);
    suspended: boolean;
    password?: (string | null);
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type VoucherTaskCreate = {
    task_name: string;
    points: number;
    description?: (string | null);
    task_users: (Array<(number)> | null);
};

export type VoucherTaskPublic = {
    id: number;
    task_name: string;
    points: number;
    task_users: Array<TaskUserPublic>;
    created_at: string;
    updated_at: string;
    description?: (string | null);
};

export type VoucherTaskRequestCreate = {
    user_ids: Array<(number)>;
    state: RequestState;
};

export type VoucherTaskTransactionPublic = {
    id: number;
    amount: number;
    parent_id: number;
    parent_type: string;
    created_at: string;
    task_user: TaskUserPublic;
};

export type VoucherTaskUpdate = {
    task_name: string;
    points: number;
    description?: (string | null);
};

export type LogInAuthLoginPostData = {
    body: Body_log_in_auth_login_post;
};

export type LogInAuthLoginPostResponse = (Token);

export type LogInAuthLoginPostError = (HTTPValidationError);

export type LogoutAuthLogoutGetResponse = (unknown);

export type LogoutAuthLogoutGetError = unknown;

export type GetUserAuthSessionGetData = unknown;

export type GetUserAuthSessionGetResponse = (UserPublic);

export type GetUserAuthSessionGetError = (HTTPValidationError);

export type GetAllUsersUsersGetData = unknown;

export type GetAllUsersUsersGetResponse = (Array<UserPublic>);

export type GetAllUsersUsersGetError = (HTTPValidationError);

export type CreateUserUsersPostData = {
    body: UserCreate;
};

export type CreateUserUsersPostResponse = (string);

export type CreateUserUsersPostError = (HTTPValidationError);

export type GetUserUsersUserIdGetData = {
    path: {
        user_id: number;
    };
};

export type GetUserUsersUserIdGetResponse = (UserPublic);

export type GetUserUsersUserIdGetError = (HTTPValidationError);

export type UpdateUserUsersUserIdPutData = {
    body: UserUpdate;
    path: {
        user_id: number;
    };
};

export type UpdateUserUsersUserIdPutResponse = (unknown);

export type UpdateUserUsersUserIdPutError = (HTTPValidationError);

export type CreateFileFilesPostData = {
    body: Body_create_file_files_post;
};

export type CreateFileFilesPostResponse = (unknown);

export type CreateFileFilesPostError = (HTTPValidationError);

export type GetAllProductsProductsGetData = unknown;

export type GetAllProductsProductsGetResponse = (Array<MiniProductPublic>);

export type GetAllProductsProductsGetError = (HTTPValidationError);

export type CreateProductProductsPostData = {
    body: ProductCreate;
};

export type CreateProductProductsPostResponse = (MiniProductPublic);

export type CreateProductProductsPostError = (HTTPValidationError);

export type GetProductProductsProductIdGetData = {
    path: {
        product_id: number;
    };
};

export type GetProductProductsProductIdGetResponse = (ProductPublic);

export type GetProductProductsProductIdGetError = (HTTPValidationError);

export type UpdateProductProductsProductIdPutData = {
    body: ProductCreate;
    path: {
        product_id: number;
    };
};

export type UpdateProductProductsProductIdPutResponse = (MiniProductPublic);

export type UpdateProductProductsProductIdPutError = (HTTPValidationError);

export type GetAllOrdersOrdersGetData = unknown;

export type GetAllOrdersOrdersGetResponse = (Array<MiniOrderPublic>);

export type GetAllOrdersOrdersGetError = (HTTPValidationError);

export type CreateOrderOrdersPostData = {
    body: OrderCreate;
};

export type CreateOrderOrdersPostResponse = (unknown);

export type CreateOrderOrdersPostError = (HTTPValidationError);

export type GetOrderOrdersOrderIdGetData = {
    path: {
        order_id: number;
    };
};

export type GetOrderOrdersOrderIdGetResponse = (OrderPublic);

export type GetOrderOrdersOrderIdGetError = (HTTPValidationError);

export type UpdateOrderOrdersOrderIdPatchData = {
    body: OrderUpdate;
    path: {
        order_id: number;
    };
};

export type UpdateOrderOrdersOrderIdPatchResponse = (unknown);

export type UpdateOrderOrdersOrderIdPatchError = (HTTPValidationError);

export type GetAllAuctionsAuctionsGetData = unknown;

export type GetAllAuctionsAuctionsGetResponse = (Array<AuctionPublic>);

export type GetAllAuctionsAuctionsGetError = (HTTPValidationError);

export type CreateAuctionAuctionsPostData = {
    body: AuctionCreate;
};

export type CreateAuctionAuctionsPostResponse = (unknown);

export type CreateAuctionAuctionsPostError = (HTTPValidationError);

export type GetAuctionAuctionsAuctionIdGetData = {
    path: {
        auction_id: number;
    };
};

export type GetAuctionAuctionsAuctionIdGetResponse = (AuctionPublic);

export type GetAuctionAuctionsAuctionIdGetError = (HTTPValidationError);

export type CompleteAuctionAuctionsAuctionIdPutData = {
    path: {
        auction_id: number;
    };
};

export type CompleteAuctionAuctionsAuctionIdPutResponse = (unknown);

export type CompleteAuctionAuctionsAuctionIdPutError = (HTTPValidationError);

export type MakeBidAuctionsAuctionIdBidsPostData = {
    body: BidCreate;
    path: {
        auction_id: number;
    };
};

export type MakeBidAuctionsAuctionIdBidsPostResponse = (unknown);

export type MakeBidAuctionsAuctionIdBidsPostError = (HTTPValidationError);

export type GetAllTasksVoucherTaskGetData = unknown;

export type GetAllTasksVoucherTaskGetResponse = (Array<VoucherTaskPublic>);

export type GetAllTasksVoucherTaskGetError = (HTTPValidationError);

export type AddTaskVoucherTaskPostData = {
    body: VoucherTaskCreate;
};

export type AddTaskVoucherTaskPostResponse = (VoucherTaskPublic);

export type AddTaskVoucherTaskPostError = (HTTPValidationError);

export type GetTaskVoucherTaskTaskIdGetData = {
    path: {
        task_id: number;
    };
};

export type GetTaskVoucherTaskTaskIdGetResponse = (VoucherTaskPublic);

export type GetTaskVoucherTaskTaskIdGetError = (HTTPValidationError);

export type UpdateTaskVoucherTaskTaskIdPutData = {
    body: VoucherTaskUpdate;
    path: {
        task_id: number;
    };
};

export type UpdateTaskVoucherTaskTaskIdPutResponse = (VoucherTaskPublic);

export type UpdateTaskVoucherTaskTaskIdPutError = (HTTPValidationError);

export type DeleteTaskVoucherTaskTaskIdDeleteData = {
    path: {
        task_id: number;
    };
};

export type DeleteTaskVoucherTaskTaskIdDeleteResponse = (unknown);

export type DeleteTaskVoucherTaskTaskIdDeleteError = (HTTPValidationError);

export type JoinRequestVoucherTaskTaskIdRequestsJoinPostData = {
    path: {
        task_id: number;
    };
};

export type JoinRequestVoucherTaskTaskIdRequestsJoinPostResponse = (unknown);

export type JoinRequestVoucherTaskTaskIdRequestsJoinPostError = (HTTPValidationError);

export type AddRequestVoucherTaskTaskIdRequestsPostData = {
    body: VoucherTaskRequestCreate;
    path: {
        task_id: number;
    };
};

export type AddRequestVoucherTaskTaskIdRequestsPostResponse = (unknown);

export type AddRequestVoucherTaskTaskIdRequestsPostError = (HTTPValidationError);

export type ApproveRequestsVoucherTaskTaskIdRequestsApprovePutData = {
    body: ApprovalUpdate;
    path: {
        task_id: number;
    };
};

export type ApproveRequestsVoucherTaskTaskIdRequestsApprovePutResponse = (unknown);

export type ApproveRequestsVoucherTaskTaskIdRequestsApprovePutError = (HTTPValidationError);

export type RejectRequestsVoucherTaskTaskIdRequestsRejectPutData = {
    body: ApprovalUpdate;
    path: {
        task_id: number;
    };
};

export type RejectRequestsVoucherTaskTaskIdRequestsRejectPutResponse = (unknown);

export type RejectRequestsVoucherTaskTaskIdRequestsRejectPutError = (HTTPValidationError);

export type UnapproveRequestsVoucherTaskTaskIdRequestsUnapprovePutData = {
    body: ApprovalUpdate;
    path: {
        task_id: number;
    };
};

export type UnapproveRequestsVoucherTaskTaskIdRequestsUnapprovePutResponse = (unknown);

export type UnapproveRequestsVoucherTaskTaskIdRequestsUnapprovePutError = (HTTPValidationError);

export type UnrejectRequestsVoucherTaskTaskIdRequestsUnrejectPutData = {
    body: ApprovalUpdate;
    path: {
        task_id: number;
    };
};

export type UnrejectRequestsVoucherTaskTaskIdRequestsUnrejectPutResponse = (unknown);

export type UnrejectRequestsVoucherTaskTaskIdRequestsUnrejectPutError = (HTTPValidationError);