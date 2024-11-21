import { Alert, Button, ButtonProps, Modal, Tooltip, TooltipProps } from "antd";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  CsMutateButtonClickEvent,
  CsQueryButtonClickEvent,
  CsView,
  executeValidation,
} from "../../logics";
import "./AxCtrl.css";

export interface AxEventProps {
  addClassNames?: string[];
}

const getClassName = (props: AxEventProps, base: string): string => {
  let names = [base];
  if (props.addClassNames) {
    names = names.concat(props.addClassNames);
  }
  return names.join(" ");
};

// Promise型かどうかを判定する関数
const isPromise = (obj: any): obj is Promise<any> => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};

export interface AxButtonProps extends AxEventProps {
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined;
  onClick: (() => boolean) | (() => void);
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  antdProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onAfterClickSuccess?: () => void | Promise<void>;
  onAfterClickError?: () => void | Promise<void>;
}

export const AxButton = (props: AxButtonProps) => {
  const { onClick, validationViews, antdProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();

  const onClickWrap = useCallback(async () => {
    const validationOk = executeValidation(validationViews);
    setShowStatus("");
    if (!validationOk) {
      setShowStatus("validation");
      return;
    }
    if (confirmOption) {
      const {
        title,
        content,
        okText,
        cancelText,
        okButtonProps,
        cancelButtonProps,
      } = confirmOption;
      const result = await new Promise((resolve) => {
        Modal.confirm({
          title: title,
          content,
          closable: false,
          okText,
          okType: "primary",
          okButtonProps: okButtonProps,
          cancelText: cancelText || "キャンセル",
          cancelButtonProps: cancelButtonProps,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
          modalRender: (modal) => modal,
          style: { whiteSpace: "pre-wrap" },
        });
      });
      if (!result) {
        return;
      }
    }
    if (onClick() === false) {
      setShowStatus("error");
      if (props.onAfterClickError) {
        const result = props.onAfterClickError();
        if (isPromise(result)) {
          await result;
        }
      }
    } else {
      setShowStatus("success");
      if (props.onAfterClickSuccess) {
        props.onAfterClickSuccess();
        const result = props.onAfterClickSuccess();
        if (isPromise(result)) {
          await result;
        }
      }
    }
  }, [confirmOption, onClick, props, validationViews]);

  const isShowDisableReason = () => {
    const disabledReason =
      props.disabledTooltipProps?.title ?? props.disabledReason;
    return antdProps?.disabled === true && disabledReason;
  };
  return (
    <div className={getClassName(props, "button-area")}>
      {showStatus === "success" && props.successMessage && (
        <Alert
          className="button-alert"
          message={props.successMessage}
          type="success"
          showIcon
          closable
          onClose={() => setShowStatus(undefined)}
        />
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert
          className="button-alert"
          message={props.errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setShowStatus(undefined)}
        />
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert
          className="button-alert"
          message={props.validateErrorMessage}
          type="warning"
          showIcon
          closable
          onClose={() => setShowStatus(undefined)}
        />
      )}
      <Tooltip
        open={isShowDisableReason() ? undefined : false}
        title={props.disabledReason}
        {...props.disabledTooltipProps}
      >
        <Button
          className={getClassName(props, "button")}
          type={props.type}
          onClick={() => {
            onClickWrap();
          }}
          {...antdProps}
        >
          {props.children}
        </Button>
      </Tooltip>
    </div>
  );
};

interface ConfirmOption {
  title: ReactNode;
  content: ReactNode;
  okText: string;
  cancelText?: string;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

export interface AxMutateButtonProps<
  TApiRequest = unknown,
  TApiResponse = unknown,
> extends AxEventProps {
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined;
  event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>;
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  antdProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onBeforeApiCall?:
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => boolean)
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => void)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<boolean>)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<void>);
  onAfterApiCallSuccess?:
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => void)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<void>);
  onAfterApiCallError?:
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => void)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<void>);
}

export const AxMutateButton = <TApiRequest = unknown, TApiResponse = unknown>(
  props: AxMutateButtonProps<TApiRequest, TApiResponse>,
) => {
  const { event, validationViews, antdProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleApiCall = async () => {
      if (clicked) {
        if (!event.isLoading) {
          if (event.isSuccess) {
            if (props.onAfterApiCallSuccess) {
              const result = props.onAfterApiCallSuccess(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          } else if (event.isError) {
            if (props.onAfterApiCallError) {
              const result = props.onAfterApiCallError(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          }
        }
      }
    };

    handleApiCall();

    // イベント内にはリクエストデータが含まれるため、以下の3つのパラメータだけを依存関係とする
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.isLoading, event.isSuccess, event.isError]);

  const onClick = useCallback(async () => {
    const validationOk = executeValidation(validationViews);
    setShowStatus("");
    if (!validationOk) {
      setShowStatus("validation");
      return;
    }
    if (event.apiRequest === undefined) {
      setShowStatus("noRequest");
      return;
    }
    if (confirmOption) {
      const {
        title,
        content,
        okText,
        cancelText,
        okButtonProps,
        cancelButtonProps,
      } = confirmOption;
      const result = await new Promise((resolve) => {
        Modal.confirm({
          title: title,
          content,
          closable: false,
          okText,
          okType: "primary",
          okButtonProps: okButtonProps,
          cancelText: cancelText || "キャンセル",
          cancelButtonProps: cancelButtonProps,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
          modalRender: (modal) => modal,
          style: { whiteSpace: "pre-wrap" },
        });
      });
      if (!result) {
        return;
      }
    }
    if (props.onBeforeApiCall) {
      const result = props.onBeforeApiCall(event);
      if (isPromise(result)) {
        const resolve = await result;
        if (resolve === false) {
          return;
        }
      } else if (result === false) {
        return;
      }
    }
    setClicked(true);
    await event.onClick();
  }, [confirmOption, event, props, validationViews]);

  const isShowDisableReason = () => {
    const disabledReason =
      props.disabledTooltipProps?.title ?? props.disabledReason;
    return antdProps?.disabled === true && disabledReason;
  };

  return (
    <div className={getClassName(props, "button-area")}>
      {event.isSuccess && props.successMessage && (
        <Alert
          className="button-alert"
          message={props.successMessage}
          type="success"
          showIcon
          closable
        />
      )}
      {event.isError && props.errorMessage && (
        <Alert
          className="button-alert"
          message={props.errorMessage}
          type="error"
          showIcon
          closable
        />
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert
          className="button-alert"
          message={props.validateErrorMessage}
          type="warning"
          showIcon
          closable
          onClose={() => setShowStatus(undefined)}
        />
      )}
      {showStatus === "noRequest" && props.validationViews && (
        <Alert
          className="button-alert"
          message="リクエストがありません"
          type="warning"
          showIcon
          closable
          onClose={() => setShowStatus(undefined)}
        />
      )}
      <Tooltip
        open={isShowDisableReason() ? undefined : false}
        title={props.disabledReason}
        {...props.disabledTooltipProps}
      >
        <Button
          className={getClassName(props, "button")}
          type={props.type}
          loading={event.isLoading}
          onClick={() => {
            onClick();
          }}
          disabled={event.apiRequest === undefined}
          {...antdProps}
        >
          {props.children}
        </Button>
      </Tooltip>
    </div>
  );
};

export interface AxQueryButtonProps<TApiResponse = unknown>
  extends AxEventProps {
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined;
  event: CsQueryButtonClickEvent<TApiResponse>;
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  antdProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onBeforeApiCall?:
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => boolean)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => void)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<boolean>)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<void>);
  onAfterApiCallSuccess?:
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => void)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<void>);
  onAfterApiCallError?:
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => void)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<void>);
}

export const AxQueryButton = <TApiResponse = unknown,>(
  props: AxQueryButtonProps<TApiResponse>,
) => {
  const { event, validationViews, antdProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleApiCall = async () => {
      if (clicked) {
        if (!event.isLoading) {
          if (event.isSuccess) {
            if (props.onAfterApiCallSuccess) {
              const result = props.onAfterApiCallSuccess(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          } else if (event.isError) {
            if (props.onAfterApiCallError) {
              const result = props.onAfterApiCallError(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          }
        }
      }
    };

    handleApiCall();
    // イベント内には検索条件が含まれるため、以下の3つのパラメータだけを依存関係とする
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.isLoading, event.isSuccess, event.isError]);

  const onClick = useCallback(async () => {
    const validationOk = executeValidation(validationViews);
    setShowStatus("");
    if (!validationOk) {
      setShowStatus("validation");
      return;
    }
    if (confirmOption) {
      const {
        title,
        content,
        okText,
        cancelText,
        okButtonProps,
        cancelButtonProps,
      } = confirmOption;
      const result = await new Promise((resolve) => {
        Modal.confirm({
          title: title,
          content,
          closable: false,
          okText,
          okType: "primary",
          okButtonProps: okButtonProps,
          cancelText: cancelText || "キャンセル",
          cancelButtonProps: cancelButtonProps,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
          modalRender: (modal) => modal,
          style: { whiteSpace: "pre-wrap" },
        });
      });
      if (!result) {
        return;
      }
    }
    if (props.onBeforeApiCall) {
      const result = props.onBeforeApiCall(event);
      if (isPromise(result)) {
        const resolve = await result;
        if (resolve === false) {
          return;
        }
      } else if (result === false) {
        return;
      }
    }
    setClicked(true);
    await event.onClick();
  }, [confirmOption, event, props, validationViews]);

  const isShowDisableReason = () => {
    const disabledReason =
      props.disabledTooltipProps?.title ?? props.disabledReason;
    return antdProps?.disabled === true && disabledReason;
  };

  return (
    <div className={getClassName(props, "button-area")}>
      {event.isSuccess && props.successMessage && (
        <Alert
          className="button-alert"
          message={props.successMessage}
          type="success"
          showIcon
          closable
        />
      )}
      {event.isError && props.errorMessage && (
        <Alert
          className="button-alert"
          message={props.errorMessage}
          type="error"
          showIcon
          closable
        />
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert
          className="button-alert"
          message={props.validateErrorMessage}
          type="warning"
          showIcon
          closable
          onClose={() => setShowStatus(undefined)}
        />
      )}
      <Tooltip
        open={isShowDisableReason() ? undefined : false}
        title={props.disabledReason}
        {...props.disabledTooltipProps}
      >
        <Button
          className={getClassName(props, "button")}
          type={props.type}
          loading={event.isLoading}
          onClick={() => {
            onClick();
          }}
          {...antdProps}
        >
          {props.children}
        </Button>
      </Tooltip>
    </div>
  );
};