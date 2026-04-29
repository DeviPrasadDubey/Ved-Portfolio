declare module "react-simple-maps" {
  import { ReactNode, SVGProps } from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }
  export function ComposableMap(props: ComposableMapProps): JSX.Element;

  export interface ZoomableGroupProps {
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    center?: [number, number];
    children?: ReactNode;
  }
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;

  export interface GeographiesProps {
    geography: string | Record<string, unknown>;
    children: (args: { geographies: Geography[] }) => ReactNode;
  }
  export function Geographies(props: GeographiesProps): JSX.Element;

  export interface Geography {
    rsmKey: string;
    [key: string]: unknown;
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }
  export function Geography(props: GeographyProps): JSX.Element;

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }
  export function Marker(props: MarkerProps): JSX.Element;

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  }
  export function Line(props: LineProps): JSX.Element;
}
