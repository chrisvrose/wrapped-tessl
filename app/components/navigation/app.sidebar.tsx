import {
  IconCurrencyDollar,
  IconDeviceGamepad2,
  IconFileText,
  IconTimeDuration10,
  IconChartBar,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const AppSidebar = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const checkActive = (path: string) => pathname === path;

  return (
    <Sidebar variant="inset">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton>DO something</SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      {/* ~ =================================== ~ */}
      {/* -- Content -- */}
      {/* ~ =================================== ~ */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/")}
                onClick={() => navigate("/")}
                size="default"
              >
                <IconDeviceGamepad2 size={20} stroke={1.5} />
                <span>Most played</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/spendings")}
                onClick={() => navigate("/spendings")}
                size="default"
              >
                <IconCurrencyDollar size={20} stroke={1.5} />
                <span>Spendings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/projects")}
                onClick={() => navigate("/projects")}
                size="default"
              >
                <IconTimeDuration10 size={20} stroke={1.5} />
                <span>Hours played</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={checkActive("/games-chart")}
                  onClick={() => navigate("/games-chart")}
                  size="default"
                >
                  <IconChartBar size={20} stroke={1.5} />
                  <span>Games Chart</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={checkActive("/specs")}
                  onClick={() => navigate("/specs")}
                  size="default"
                >
                  <IconFileText size={20} stroke={1.5} />
                  <span>Spec files</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ~ =================================== ~ */}
      {/* -- Footer -- */}
      {/* ~ =================================== ~ */}
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
