import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  color = "#2196F3",
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="subtitle2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              color: "white",
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
